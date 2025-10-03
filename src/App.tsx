import React, { useState } from 'react';
import parseLLMJson from './utils/jsonParser';

interface FortuneData {
  fortune: string;
  theme: 'red' | 'blue';
  tone: 'mysterious' | 'optimistic';
  length: number;
}

interface FormattedFortune {
  title: string;
  content: string;
  styling: {
    theme_color: '#D32F2F' | '#1976D2';
    font_style: 'matrix-code' | 'serene';
    decorators: string[];
  };
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [formattedFortune, setFormattedFortune] = useState<FormattedFortune | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateRandomId = () => Math.random().toString(36).substring(7);

  const callFortuneAgent = async (pillType: 'red' | 'blue'): Promise<FortuneData | null> => {
    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-obhGvAo6gG9YT9tu6ChjyXLqnw7TxSGY'
        },
        body: JSON.stringify({
          user_id: `user${generateRandomId()}@test.com`,
          agent_id: '68e02c42f40da92f699a9532',
          session_id: `session${generateRandomId()}`,
          message: pillType
        })
      });

      if (!response.ok) throw new Error('Failed to call FortuneAgent');

      const data = await response.text();
      const parsed = parseLLMJson(data);
      return parsed.result;
    } catch (error) {
      console.error('FortuneAgent error:', error);
      return null;
    }
  };

  const callRevealAgent = async (fortuneData: FortuneData): Promise<FormattedFortune | null> => {
    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-obhGvAo6gG9YT9tu6ChjyXLqnw7TxSGY'
        },
        body: JSON.stringify({
          user_id: `user${generateRandomId()}@test.com`,
          agent_id: '68e02c4f9ad1cf1f569ff3fa',
          session_id: `session${generateRandomId()}`,
          message: JSON.stringify(fortuneData)
        })
      });

      if (!response.ok) throw new Error('Failed to call RevealAgent');

      const data = await response.text();
      const parsed = parseLLMJson(data);
      return parsed.result.formatted_fortune;
    } catch (error) {
      console.error('RevealAgent error:', error);
      return null;
    }
  };

  const handlePillClick = async (pillType: 'red' | 'blue') => {
    setIsLoading(true);
    setShowResult(false);

    const fortuneData = await callFortuneAgent(pillType);
    if (fortuneData) {
      const formatted = await callRevealAgent(fortuneData);
      if (formatted) {
        setFormattedFortune(formatted);
        setTimeout(() => setShowResult(true), 100);
      }
    }

    setIsLoading(false);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setTimeout(() => {
      setFormattedFortune(null);
    }, 300);
  };

  const isRedTheme = formattedFortune?.styling.theme_color === '#D32F2F';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping opacity-30" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-50" />
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-20" />
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-30" />
        <div className="absolute bottom-32 right-16 w-1 h-1 bg-cyan-300 rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-green-300 rounded-full animate-ping opacity-25" />
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-orange-300 rounded-full animate-pulse opacity-40" />
        <div className="absolute top-2/3 right-8 w-2 h-2 bg-indigo-300 rounded-full animate-ping opacity-30" />
        <div className="absolute top-16 left-2/3 w-1 h-1 bg-red-300 rounded-full animate-pulse opacity-45" />
      </div>
      <div className="w-full max-w-2xl relative z-10">
        {!formattedFortune ? (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-wide animate-pulse">
                Fortune Pill App
              </h1>
              <p className="text-gray-300 text-lg">
                Choose your destiny. Red for mystery, Blue for serenity.
              </p>
            </div>

            <div className="flex justify-center space-x-8">
              <button
                onClick={() => handlePillClick('red')}
                disabled={isLoading}
                className="group relative px-12 py-6 rounded-full text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#D32F2F' }}
              >
                <div className="absolute inset-0 rounded-full bg-red-600 opacity-0 group-hover:opacity-20 group-hover:shadow-red-500/50 transition-all duration-300" style={{ boxShadow: '0 0 40px rgba(211, 47, 47, 0.6)' }} />
                <span className="relative z-10">Red Pill</span>
                {!isLoading && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#D32F2F' }} />
                )}
              </button>

              <button
                onClick={() => handlePillClick('blue')}
                disabled={isLoading}
                className="group relative px-12 py-6 rounded-full text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1976D2' }}
              >
                <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-20 group-hover:shadow-blue-500/50 transition-all duration-300" style={{ boxShadow: '0 0 40px rgba(25, 118, 210, 0.6)' }} />
                <span className="relative z-10">Blue Pill</span>
                {!isLoading && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#1976D2' }} />
                )}
              </button>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: isRedTheme !== undefined ? (isRedTheme ? '#D32F2F' : '#1976D2') : '#FFFFFF' }} />
                <span className="text-gray-300">Consulting the digital oracle...</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`transition-all duration-700 ${showResult ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <div
              className="rounded-2xl p-8 backdrop-blur-sm border border-gray-700"
              style={{
                backgroundColor: '#181F22',
                boxShadow: `0 0 60px ${isRedTheme ? 'rgba(211, 47, 47, 0.3)' : 'rgba(25, 118, 210, 0.3)'}, 0 0 120px ${isRedTheme ? 'rgba(211, 47, 47, 0.2)' : 'rgba(25, 118, 210, 0.2)'}`
              }}
            >
              <div className="text-center space-y-6">
                <h2
                  className="text-3xl font-bold mb-4 animate-bounce"
                  style={{ color: isRedTheme ? '#D32F2F' : '#1976D2' }}
                >
                  {formattedFortune.title}
                </h2>

                <div
                  className={`text-lg leading-relaxed text-gray-200 text-center whitespace-pre-line animate-pulse ${formattedFortune.styling.font_style === 'matrix-code' ? 'font-mono' : 'font-sans'}`}
                >
                  {formattedFortune.content}
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleTryAgain}
                    className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    style={{ backgroundColor: isRedTheme ? '#1976D2' : '#D32F2F' }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;