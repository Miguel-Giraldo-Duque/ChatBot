import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';




console.log(import.meta.env.VITE_API_KEY)

 
function App() {
  const[typing , setyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message:"Hi i am Mr. Trustify !",
      sender: "ChatGPT"
    }
  ])

  const handleSend  = async (message) =>{
    const newMessage = {
      message:message,
      sender:"user",
      direction: "outgoing"
    }

    const newMessages = [...messages , newMessage]

    setMessages(newMessages);


    setyping(true)
    await processMessageToChatGPT(newMessages)

}

  async function processMessageToChatGPT(chatMessages) {
    
    let apiMessages = chatMessages.map((messageObjetct) =>{
      let role = ""
      if( messageObjetct.sender === "ChatGPT"){
        role = "assistant"
      }else{
        role = "user"
      }

      return {role: role, content:messageObjetct.message  }
  })
  
  const sytemMessage = {
    role: "system",
    content: "talk like a hotel booking agency"
  }
  const apiRequestBody = {
    "model" : "gpt-3.5-turbo",
    "messages" :[
      sytemMessage,
      ...apiMessages
    ]

  }

  await fetch("https://api.openai.com/v1/chat/completions" , {
    method: "POST",
    headers:{
      "Authorization": "Bearer " + import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(apiRequestBody)
  }).then((data) =>{
      return data.json()
  }).then((data) =>{  
    setMessages(
      [...chatMessages, {
        message:data.choices[0].message.content,
        sender: "ChatGPT"
      }]
    )
    setyping(false);
  })

}




return(

    <div className='App'>
      <div style={{position : "relative" , height: "600px", width:"700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior='smooth'
              typingIndicator = {typing ?  <TypingIndicator content="Typing chill"/> :  null} 
            >
              {
                messages.map((message , i ) =>{
                  return <Message key={i} model = {message}/>
                }) 
              }
            </MessageList>
            <MessageInput placeholder='Type here'  onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
