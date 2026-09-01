import React from 'react'
import ResumeForm from '../components/resume/ResumeForm';
import initialData from '../components/resume/initialData.js';

function ResumeBuilder({user, setUser}) {
  const [currentStep, setCurrentStep] = React.useState(4);
  const [data, setData] = React.useState(initialData);

  return (
    <div className="min-h-screen max-w-2xl w-full mx-auto mt-5 ">
      <ResumeForm step={currentStep} data={data} setData={setData} />
    </div>
  )
}

export default ResumeBuilder
