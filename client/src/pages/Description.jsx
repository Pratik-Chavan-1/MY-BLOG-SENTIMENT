import React from 'react'

export default function Description({response}) {

    // const response = {"Response": [{"Aspect": "Build Quality", "Sentiment": "Positive"}, {"Aspect": "Brand (Apple)", "Sentiment": "Positive"}, {"Aspect": "Size and Weight", "Sentiment": "Neutral"}, {"Aspect": "Screen Size", "Sentiment": "Neutral"}]} ;

  return (
    <div className='min-h-screen' >
        <ul className='flex gap-4 flex-col p-6 mx-auto w-1/2 my-10' >
           {response.map((aspect,index)=>(
               <li key={index}>
           <span className='mr-3'> 
          Aspect :
            <span className=' ml-2 font-bold text-green-400' >
         {aspect.Aspect} 
            </span>
            </span>
            {/* <span>
            {'-->'}
            </span> */}
            <p>
            Sentimenet :  
            <span className='ml-3 font-bold text-orange-500'>{aspect.Sentiment}
            </span>
            </p>
               </li>
           ))}

        </ul>
    </div>
  )
}
