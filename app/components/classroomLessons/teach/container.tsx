import * as React from 'react';
import { connect } from 'react-redux';
import {
  startListeningToSession,
  startListeningToSessionWithoutCurrentSlide,
  startListeningToCurrentSlide,
  goToNextSlide,
  updateCurrentSlide,
  updateCurrentSlideInStore,
  saveSelectedStudentSubmission,
  removeSelectedStudentSubmission,
  setMode,
  removeMode,
  getClassroomAndTeacherNameFromServer,
  loadStudentNames,
  toggleOnlyShowHeaders,
  clearAllSelectedSubmissions,
  clearAllSubmissions,
  updateSlideInFirebase
} from '../../../actions/classroomSessions';
import CLLobby from './lobby';
import CLStatic from './static.jsx';
import CLSingleAnswer from './singleAnswer.jsx';
import CLStudentLobby from '../play/lobby';
import CLStudentStatic from '../play/static.jsx';
import MainContentContainer from './mainContentContainer.jsx';
import CLStudentSingleAnswer from '../play/singleAnswer.jsx';
import { getParameterByName } from 'libs/getParameterByName';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
} from '../interfaces';

class TeachClassroomLessonContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
    this.toggleOnlyShowHeaders = this.toggleOnlyShowHeaders.bind(this);
    this.clearAllSelectedSubmissions = this.clearAllSelectedSubmissions.bind(this)
    this.clearAllSubmissions = this.clearAllSubmissions.bind(this)
    this.renderSidebar = this.renderSidebar.bind(this)
  }

  componentDidMount() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      // this.props.dispatch(getClassroomAndTeacherNameFromServer(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames(ca_id || '', process.env.EMPIRICAL_BASE_URL))
      // below is for spoofing if you log in with Amber M. account
      // this.props.dispatch(getClassroomAndTeacherNameFromServer('341912', process.env.EMPIRICAL_BASE_URL))
      // this.props.dispatch(loadStudentNames('341912', process.env.EMPIRICAL_BASE_URL))
      this.props.dispatch(startListeningToSessionWithoutCurrentSlide(ca_id));
      this.props.dispatch(startListeningToCurrentSlide(ca_id));
    }
  }

  componentDidUpdate(prevProps) {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    console.log(prevProps.classroomSessions.data.current_slide, this.props.classroomSessions.data.current_slide, prevProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide)
    if (prevProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide) {
      updateSlideInFirebase(ca_id, this.props.classroomSessions.data.current_slide)
    }
  }

  goToNextSlide() {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      const updateInStore = goToNextSlide(ca_id, this.props.classroomSessions.data);
      if (updateInStore) {
          this.props.dispatch(updateInStore);
      };
    };
  };

  goToSlide(slide_id: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id')
    if (ca_id) {
      this.props.dispatch(updateCurrentSlide(ca_id, slide_id));
    }
  }

  toggleSelected(current_slide: string, student: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      const submissions: SelectedSubmissions | null = this.props.classroomSessions.data.selected_submissions;
      const currentSlide: SelectedSubmissionsForQuestion | null = submissions ? submissions[current_slide] : null;
      const currentValue: boolean | null = currentSlide ? currentSlide[student] : null;
      if (!currentValue) {
        saveSelectedStudentSubmission(ca_id, current_slide, student);
      } else {
        removeSelectedStudentSubmission(ca_id, current_slide, student);
      }
    }

  }

  clearAllSelectedSubmissions(current_slide: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      clearAllSelectedSubmissions(ca_id, current_slide)
    }
  }

  clearAllSubmissions(current_slide: string) {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      clearAllSubmissions(ca_id, current_slide)
    }
  }

  toggleOnlyShowHeaders() {
    this.props.dispatch(toggleOnlyShowHeaders())
  }

  startDisplayingAnswers() {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      setMode(ca_id, this.props.classroomSessions.data.current_slide, 'PROJECT');
    }
  }

  stopDisplayingAnswers() {
    const ca_id: string|null = getParameterByName('classroom_activity_id');
    if (ca_id) {
      removeMode(ca_id, this.props.classroomSessions.data.current_slide);
    }
  }

  renderSidebar(data: ClassroomLessonSession) {
    const questions = data.questions;
    const length = questions.length;
    const current_slide = data.current_slide;
    let components: JSX.Element[] = []
    let counter = 0;
    for (let slide in questions) {
      counter += 1;
      const activeClass = current_slide === slide ? "active" : ""
      let thumb;
      switch (questions[slide].type) {
        case 'CL-LB':
          thumb = (
            <span/>
            // <CLStudentLobby data={data} />
          );
          break
        case 'CL-ST':
          thumb = (
            <span/>
            // <CLStudentStatic data={questions[slide].data} />
          );
          break
        case 'CL-SA':
          // const mode: string | null = data.modes && data.modes[data.current_slide] ? data.modes[data.current_slide] : null;
          // const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[data.current_slide] ? data.submissions[data.current_slide] : null;
          // const selected_submissions = data.selected_submissions && data.selected_submissions[data.current_slide] ? data.selected_submissions[data.current_slide] : null;
          // const props = { mode, submissions, selected_submissions, };
          thumb = (
            <span/>
            // <CLStudentSingleAnswer data={questions[slide].data} handleStudentSubmission={this.handleStudentSubmission} {...props} />
          );
          break
        default:
          thumb = questions[slide].type
      }
      components.push((
        <div key={counter} onClick={() => this.goToSlide(slide)}>
          <p className={"slide-number " + activeClass}>Slide {counter} / {length}</p>
          <div className={"slide-preview " + activeClass}>
            <div className="scaler">
            {thumb}
            </div>
          </div>
        </div>
      ))
    }
    return components
  }



  render() {
    const { data, hasreceiveddata, } = this.props.classroomSessions;
    if (hasreceiveddata && data) {
        return (
          <div className="teach-lesson-container">
            <div className="side-bar">
              {this.renderSidebar(data)}
            </div>
            <MainContentContainer/>
          </div>
        );
    }
    return (
      <div>
        Loading...
      </div>
    );
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    // classroomLessons: props.classroomLessons,
  };
}

export default connect(select)(TeachClassroomLessonContainer);
