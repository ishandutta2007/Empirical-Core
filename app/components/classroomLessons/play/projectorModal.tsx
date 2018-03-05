import * as React from 'react'

const ProjectorModal: React.SFC<{closeModal: any}> = (props) => {
 return <div className="projector-modal-container">
    <div className="projector-modal-background" />
     <div className="projector-modal">
       <div className="top-section">
          <img onClick={props.closeModal} className="exit" src="http://assets.quill.org/images/icons/CloseIcon.svg"/>
          <img className="illustration" src="http://assets.quill.org/images/illustrations/projector_modal.svg" />
          <h1><span>Next:</span> Project this window</h1>
          <p>Project this screen to your students by adjusting your display settings to unmirrored mode so that you can project this window while looking at a different window on your computer.</p>
          <p className="follow-instructions">Follow the instructions below to adjust your display settings, and then drag this window to the left or right of your screen to project.</p>
          <button onClick={props.closeModal}>Got it!</button>
        </div>
        <div className="bottom-section">
          <p className="bottom-section-header">How to adjust your display settings?</p>

          <div className="list">
            <p className="list-header">For Windows:</p>
            <p className="list-item">1. Go to Control Panel or right-click on your desktop.</p>
            <p className="list-item">2. Choose Display Settings.</p>
            <p className="list-item">3. Select Extend Desktop from Multiple Display Dropdown.</p>
          </div>

          <div className="list">
            <p className="list-header">For Macs:</p>
            <p className="list-item">1. Go to System Preferences.</p>
            <p className="list-item">2. Go to Displays.</p>
            <p className="list-item">3. Select the Arrangement tab.</p>
            <p className="list-item">4. Uncheck Mirror Displays.</p>
          </div>

        </div>
     </div>
   </div>
}

export default ProjectorModal
