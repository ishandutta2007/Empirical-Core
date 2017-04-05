import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Admin from '../components/admin/admin.jsx';
import ConceptsFeedback from '../components/feedback/concepts-feedback.jsx';
import ConceptFeedback from '../components/feedback/concept-feedback.jsx';
import Concepts from '../components/concepts/concepts.jsx';
import Concept from '../components/concepts/concept.jsx';
import ScoreAnalysis from '../components/scoreAnalysis/scoreAnalysis.jsx';
import Questions from '../components/questions/questions.jsx';
import Question from '../components/questions/question.jsx';
import ResponseComponentWrapper from '../components/questions/responseRouteWrapper.jsx';
import DiagnosticQuestions from '../components/diagnosticQuestions/diagnosticQuestions.jsx';
import DiagnosticQuestion from '../components/diagnosticQuestions/diagnosticQuestion.jsx';
import SentenceFragments from '../components/sentenceFragments/sentenceFragments.jsx';
import NewSentenceFragment from '../components/sentenceFragments/newSentenceFragment.jsx';
import SentenceFragment from '../components/sentenceFragments/sentenceFragment.jsx';
import Lessons from '../components/lessons/lessons.jsx';
import Lesson from '../components/lessons/lesson.jsx';
import LessonResults from '../components/lessons/lessonResults.jsx';
import Diagnostics from '../components/diagnostics/diagnostics.jsx';
import NewDiagnostic from '../components/diagnostics/new.jsx';
import ItemLevels from '../components/itemLevels/itemLevels.jsx';
import ItemLevel from '../components/itemLevels/itemLevel.jsx';
import ItemLevelForm from '../components/itemLevels/itemLevelForm.jsx';
import ItemLevelDetails from '../components/itemLevels/itemLevelDetails.jsx';
import FocusPointsContainer from '../components/focusPoints/focusPointsContainer.jsx';
import EditFocusPointsContainer from '../components/focusPoints/editFocusPointsContainer.jsx';
import NewFocusPointsContainer from '../components/focusPoints/newFocusPointsContainer.jsx';
import IncorrectSequenceContainer from '../components/incorrectSequence/incorrectSequenceContainer.jsx';
import EditIncorrectSequenceContainer from '../components/incorrectSequence/editIncorrectSequenceContainer.jsx';
import NewIncorrectSequenceContainer from '../components/incorrectSequence/newIncorrectSequenceContainer.jsx';

const AdminRoutes = (
  <Route path="/admin" component={Admin}>
    {/* concepts section*/}
    <Route path="concepts" component={Concepts} />
    <Route path="concepts/:conceptID" component={Concept} />

    {/* questions section*/}
    <Route path="questions" component={Questions} />
    <Route path="questions/:questionID" component={Question}>
      <IndexRoute component={ResponseComponentWrapper} />
      <Route path="focus-points" component={FocusPointsContainer} />
      <Route path="focus-points/:focusPointID/edit" component={EditFocusPointsContainer} />
      <Route path="focus-points/new" component={NewFocusPointsContainer} />
      <Route path="incorrect-sequences" component={IncorrectSequenceContainer} />
      <Route path="incorrect-sequences/:incorrectSequenceID/edit" component={EditIncorrectSequenceContainer} />
      <Route path="incorrect-sequences/new" component={NewIncorrectSequenceContainer} />
    </Route>

    {/* data section*/}
    <Route path="datadash" component={ScoreAnalysis} />

    {/* questions section*/}
    <Route path="diagnostic-questions" component={DiagnosticQuestions} />
    <Route path="diagnostic-questions/:questionID" component={DiagnosticQuestion} />

    {/* sentence Fragment sections*/}
    <Route path="sentence-fragments" component={SentenceFragments} />
    <Route path="sentence-fragments/new" component={NewSentenceFragment} />
    <Route path="sentence-fragments/:sentenceFragmentID" component={SentenceFragment} />

    {/* lessons section*/}
    <Route path="lessons" component={Lessons} />
    <Route path="lessons/:lessonID" component={Lesson} />
    <Route path="lessons/:lessonID/results" component={LessonResults} />

    {/* diagnostics */}
    <Route path="diagnostics" component={Diagnostics} />
    <Route path="diagnostics/new" component={NewDiagnostic} />

    {/* targeted Feedback */}
    <Route path="concepts-feedback" component={ConceptsFeedback}>
      <Route path=":feedbackID" component={ConceptFeedback} />
    </Route>

    {/* item Levels */}
    <Route path="item-levels" component={ItemLevels} />
    <Route path="item-levels/new" component={ItemLevelForm} />
    <Route path="item-levels/:itemLevelID" component={ItemLevelDetails} />
    <Route path="item-levels/:itemLevelID/edit" component={ItemLevel} />
  </Route>
);

export default AdminRoutes;
