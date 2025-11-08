'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Helper function to extract text content from message parts
  const getMessageText = (message: typeof messages[0]) => {
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map(part => part.text)
      .join('');
  };

  // Character buttons data
  const characters = [
    { name: 'Baahubali', emoji: '👑', image: '/Prabhas.jpg', color: 'from-amber-500 to-yellow-600' },
    { name: 'Devasena', emoji: '⚔️',image: '/Devasena.jpg', color: 'from-pink-500 to-rose-600' },
    { name: 'Bhallaladeva', emoji: '🗡️', image: '/Rana.jpg', color: 'from-red-600 to-red-800' },
    { name: 'Kattappa', emoji: '🛡️', image: '/kattappa.jpg', color: 'from-gray-600 to-gray-800' },
    { name: 'Shivagami', emoji: '👸🏻', image: '/Ramyakrishna.jpg', color: 'from-gray-600 to-gray-800' },
  ];

  // Handle character button click - ask about the character
  const handleCharacterClick = (characterName: string) => {
    if (isLoading) return;
    const question = `Tell me about ${characterName}`;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: question }] });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Static Mahishmati Kingdom Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            // Replace 'mahishmati-bg.jpg' with your image filename
            // Place your image in the 'public' folder
            backgroundImage: `url('/mh2.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/40 via-orange-500/30 to-yellow-900/40"></div>
      </div>

      {/* Floating Character Buttons */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        {characters.map((character, index) => {
          // Different starting positions for each character
          const positions = [
            { top: '10%', left: '5%' },   // Top left
            { top: '20%', left: '8%' }, // Bottom right
            { top: '15%', right: '5%' },  // Top right
            { bottom: '15%', left: '8%' }, // Bottom left
            { bottom: '10%', right: '8%' }, // Bottom right
          ];
          const pos = positions[index];
          
          return (
            <button
              key={character.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCharacterClick(character.name);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`absolute pointer-events-auto group flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${character.color || 'from-gray-500 to-gray-700'} shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 border-2 border-white/30 backdrop-blur-sm animate-float cursor-pointer z-40 overflow-hidden`}
              style={{
                animationDelay: `${index * 2}s`,
                animationDuration: `${10 + index * 3}s`,
                ...pos,
              }}
              title={`Ask about ${character.name}`}
              disabled={isLoading}
            >
              {character.image ? (
                <>
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform pointer-events-none"
                  />
                  <span className="absolute -bottom-1 text-xs md:text-sm font-bold text-white drop-shadow-lg text-center px-1 pointer-events-none bg-black/50 rounded-full px-2 py-0.5">
                    {character.name.split(' ')[0]}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-3xl md:text-4xl mb-1 group-hover:scale-125 transition-transform pointer-events-none">
                    {character.emoji}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-white drop-shadow-lg text-center px-1 pointer-events-none">
                    {character.name.split(' ')[0]}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2 drop-shadow-lg font-serif">
                Ask Kattappa 
            </h1>
            <p className="text-lg md:text-2xl text-black dark:text-amber-300 drop-shadow-md">
             Before He Stabs Anyone 🗡️ 
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-2xl border-2 border-amber-200/50 dark:border-amber-800/50 flex flex-col h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-white-700 dark:text-white-200 mt-8 drop-shadow-lg">
                  <p className="text-lg font-bold mb-2">Welcome to Mahishmati! 👑</p>
                  <p>I am Kattappa, the royal storyteller. Ask me about:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Why did Kattappa kill Baahubali?</li>
                    <li>Who ruled Mahishmati after Bhallaladeva?</li>
                    <li>Tell me about Devasena's courage</li>
                    <li>How big was the Mahishmati kingdom?</li>
                  </ul>
                  <p className="mt-4 text-xs text-white-600 dark:text-white-400">
                    💡 Click on the floating character buttons to ask about them!
          </p>
        </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 backdrop-blur-md ${
                      message.role === 'user'
                        ? 'bg-amber-500/90 text-white shadow-lg'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{getMessageText(message)}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-4 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-start">
                  <div className="bg-red-100/90 dark:bg-red-900/90 backdrop-blur-md rounded-lg p-4 text-red-800 dark:text-red-200 shadow-lg">
                    Error: {error.message}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t border-amber-200/50 dark:border-amber-800/50 p-4 bg-transparent">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask Kattappa about Mahishmati..."
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-amber-300/70 dark:border-amber-700/70 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 shadow-lg"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
