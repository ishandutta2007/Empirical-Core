import {diffWords} from 'diff';
import _ from 'lodash';
import {removePunctuation} from './question.js'

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: "MISSING_WORD",
  ADDITIONAL_WORD: "ADDITIONAL_WORD",
  INCORRECT_WORD: "INCORRECT_WORD"
}


export function getChangeObjects (targetString, userString) {
  return diffWords(targetString, userString)
};

export function getChangeObjectsWithoutRemoved (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString);
  return _.reject(changeObjects, (changeObject) => {
    return changeObject.removed
  })
}

export function getChangeObjectsWithoutAdded (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString);
  return _.reject(changeObjects, (changeObject) => {
    return changeObject.added
  })
}

export function getErroneousWordLength (changeObjects, key) {
  const addedWord = _.filter(changeObjects, {[key]: true})[0]
  if(addedWord.value===',') {
    const precedingObjects = _.takeWhile(changeObjects, (changeObject) => {
      return !changeObject[key]
    })
    const segmentBeforeComma = precedingObjects[precedingObjects.length-1].value
    return segmentBeforeComma.length - segmentBeforeComma.lastIndexOf(' '); // no -1 because that is handled in the calling function
  }
  return addedWord.value.length || 0
}

export function getErroneousWordOffset (changeObjects, key, length = 0) {
  const precedingObjects = _.takeWhile(changeObjects, (changeObject) => {
    return !changeObject[key]
  })
  const offset = _.reduce(precedingObjects, (sum, changeObject) => {
    return sum + changeObject.value.length + length;
  }, 0)

  //below, edge case for underlining the previous word if a comma is missing
  const firstError = _.find(changeObjects, (changeObject) => {
    return changeObject[key]
  })
  if(firstError.value===',') {
    const segmentBeforeComma = precedingObjects[precedingObjects.length-1].value
    const wordBeforeComma = segmentBeforeComma.length - segmentBeforeComma.lastIndexOf(' ') - 1;
    return offset - wordBeforeComma
  }

  //if the last changeObject is '.', it means that the last word was missing. Offset is incremented
  //because of the space at the end of the second last word that was also missing, but that is added automatically.
  //However, if the last word was simply misspelled, we don't need to increase the offset - the preceding space already exists
  if(changeObjects.length>=2 && changeObjects[changeObjects.length-1].value==='.' && changeObjects[changeObjects.length-2].added===undefined) {
    return offset+1;
  } else {
    return offset;
  }
}

export function punctuationLength (originalUserString, userString, offsetIndex) {
  return lengthDifference(originalUserString.substring(0, offsetIndex), userString.substring(0, offsetIndex));
}

export function getInlineStyleRangeObject (targetString, userString, originalUserString=userString) {
  const changeObjects = getChangeObjectsWithoutRemoved(targetString, userString)
  const origOffset = getErroneousWordOffset(changeObjects, 'added')
  const puncLength = punctuationLength(originalUserString, userString, origOffset + 1);
  return {
    length: getErroneousWordLength(changeObjects, 'added'),
    offset: origOffset + puncLength,
    style: "UNDERLINE"
  }
}

export function lengthDifference(originalUserStringSubString, userSubString) {
  return originalUserStringSubString.length - userSubString.length
}

export function getErrorType (targetString, userString) {
  const changeObjects = getChangeObjects(targetString, userString)
  const hasIncorrect = _.some(changeObjects, (current, index, array) => {
    if (current.removed && index === array.length - 1) {
      return false
    }
    return current.removed && (array[index + 1].added)
  })
  const hasAdditions = _.some(changeObjects, (current, index, array) => {
    if (current.added && index === 0) {
      return true
    }
    return current.added && !array[index - 1].removed
  })
  const hasDeletions = _.some(changeObjects, (current, index, array) => {
    if (current.removed && index === array.length - 1) {
      return true
    }
    return current.removed && !(array[index + 1].added)
  })
  if (hasIncorrect) {
    return ERROR_TYPES.INCORRECT_WORD
  } else if (hasAdditions) {
    return ERROR_TYPES.ADDITIONAL_WORD
  } else if (hasDeletions) {
    return ERROR_TYPES.MISSING_WORD
  } else {
    return ERROR_TYPES.NO_ERROR
  }
}

export function getMissingWordErrorString (changeObjects) {
  return changeObjects.map((changeObject) => {
    if (changeObject.removed) {
      return changeObject.value===',' ? "" : _.repeat(' ', changeObject.value.length)
    } else {
      return changeObject.value
    }
  }).join('')
}

export function getMissingInlineStyleRangeObject (targetString, userString, originalUserString=userString) {
  const changeObjects = getChangeObjects(targetString, userString)
  const origOffset = getErroneousWordOffset(changeObjects, 'removed')
  const puncLength = punctuationLength(originalUserString, userString, origOffset + 1);
  return {
    length: getErroneousWordLength(changeObjects, 'removed')-1,
    offset: origOffset + puncLength,
    style: "UNDERLINE"
  }
}

export function getAdditionalInlineStyleRangeObject (targetString, userString, originalUserString=userString) {
  const changeObjects = getChangeObjects(targetString, userString)
  const origOffset = getErroneousWordOffset(changeObjects, 'added')
  const puncLength = punctuationLength(originalUserString, userString, origOffset + 1);
  return {
    length: getErroneousWordLength(changeObjects, 'added') -1,
    offset: origOffset + puncLength,
    style: "UNDERLINE"
  }
}

export function generateStyleObjects (targetString, userString, important=false) {
  const parsedUserString = important ? removePunctuation(userString).toLowerCase() : userString
  const parsedTargetString = important ? removePunctuation(targetString).toLowerCase() : targetString
  const errorType = getErrorType(targetString, userString);
  switch (errorType) {
    case ERROR_TYPES.INCORRECT_WORD:
      return {
        text: userString,
        inlineStyleRanges: [
          getInlineStyleRangeObject(parsedTargetString, parsedUserString, userString)
        ]
      }
      break;
    case ERROR_TYPES.ADDITIONAL_WORD:
      return {
        text: userString,
        inlineStyleRanges: [
          getAdditionalInlineStyleRangeObject(parsedTargetString, parsedUserString, userString)
        ]
      }
      break;
    case ERROR_TYPES.MISSING_WORD:
      return {
        text: getMissingWordErrorString(getChangeObjects(targetString, userString)),
        inlineStyleRanges: [
          getMissingInlineStyleRangeObject(parsedTargetString, parsedUserString, userString)
        ]
      }
      break;
    default:
      return {
        text: userString,
        inlineStyleRanges: []
      }
  }
}
