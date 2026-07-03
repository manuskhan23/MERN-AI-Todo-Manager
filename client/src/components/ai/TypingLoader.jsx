export default function TypingLoader() {
  return (
    <div className="flex gap-4 mb-6 justify-start">
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">AI</div>
      <div className="bg-bg p-4 rounded-xl border border-light">
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-secondary rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
          <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
        </div>
      </div>
    </div>
  );
}