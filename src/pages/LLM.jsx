import React, { useState } from 'react';
import axios from 'axios';
import './LLM.css'; 
import { useNavigate } from "react-router-dom"; 
import TextField from '@mui/material/TextField'; 

function LLM() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [laptopName, setLaptopName] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [displaySize, setDisplaySize] = useState("");
  const [processor, setProcessor] = useState("");
  const [batteryLife, setBatteryLife] = useState("");
  const [weight, setWeight] = useState("");
  const [graphicsCard, setGraphicsCard] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");

  const navigate = useNavigate(); 
  
  const handleNavigation = () => {
    navigate("/llmOutput", {
      state: {
        laptopName,
        ram,
        storage,
        displaySize,
        processor,
        batteryLife,
        weight,
        graphicsCard,
        operatingSystem
      }
    });
  };

  async function generateAnswer() {
    setAnswer("loading...");

    const basePrompt = `
      Please extract all laptop specifications mentioned in the text below and provide the information. Include details like laptop name/model, RAM, storage, display size, processor type, battery life, weight, graphics card, operating system, and any other relevant specifications. Only return the laptop details in JSON format.
      
      Input Text: `;

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAG-o2LqrH2L6M1l8-17oRi-q697WizoPw",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: basePrompt + question
                }
              ]
            }
          ]
        }
      });

      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(generatedText);

      const sanitizedText = generatedText.replace(/```json|```/g, '').trim();
      const specs = JSON.parse(sanitizedText || "{}");

      setLaptopName(specs.laptop_name || "");
      setRam(specs.RAM || "");
      setStorage(specs.storage || "");
      setDisplaySize(specs.display_size || "");
      setProcessor(specs.processor || "");
      setBatteryLife(specs.battery_life || "");
      setWeight(specs.weight || "");
      setGraphicsCard(specs.graphics_card || "");
      setOperatingSystem(specs.operating_system || "");

      setAnswer(generatedText || "No answer received");



    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Error generating answer.");
    }
  }

  return (
    <div className="llm-container">
      <h1 className='llm-h1'>What can I help with?</h1>
        <TextField
          className="llm-input"
          value={question}
          multiline
          maxRows={10}
          variant="outlined"
          placeholder="Enter laptop details here..."
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          InputProps={{
            style: { color: '#FFFFFF' }, 
            placeholder: 'Enter laptop details here...',
          }}
        />

      <button className="learn-more" onClick={generateAnswer}>Search for laptops</button>
    
      <button className="handleNavBtn" onClick={handleNavigation}>GO TO LLM OUTPUT</button>
    </div>
  );
}

export default LLM;
