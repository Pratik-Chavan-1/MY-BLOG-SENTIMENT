import React from "react";

const TestComponent = () => {
    const handleClick=()=>{};
//   const handleClick = async () => {
//     const url = "https://aspect-based-sentiment-analysis1.p.rapidapi.com/";
//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-RapidAPI-Key": "af4597fcb1msh20f6276e0dc149ap1319f7jsnef50ca383892",
//         "X-RapidAPI-Host": "aspect-based-sentiment-analysis1.p.rapidapi.com",
//       },
//       body: JSON.stringify({
//         input_text:
//           "This is a very solid device. Wonderful job, Apple! The only thing unexpected about it was the weight... the dimensions are smaller than the old macbook air my wife had, but heavier. Screen size is the same.",
//       }),
//     };

//     try {
//       const response = await fetch(url, options);
//       const result = await response.text();
//       console.log(result);
//     } catch (error) {
//       console.error(error);
//     }
//   };

  return (
    <div>
      <h1>Test Component</h1>
      <button onClick={handleClick}>Click here to analyze</button>
    </div>
  );
};

export default TestComponent;
