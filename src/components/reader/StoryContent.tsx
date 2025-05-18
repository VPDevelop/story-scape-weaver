
interface StoryContentProps {
  text: string | null;
}

const StoryContent = ({ text }: StoryContentProps) => {
  // Generate a placeholder text if the story text is empty
  const storyText = text || `Once upon a time, in a world of wonder and magic, an incredible adventure began.

This is a placeholder for your story. The real content will appear when you add text to your stories.

As our hero faced challenges and made new friends, valuable lessons were learned about courage, kindness, and perseverance.

THE END`;

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <div className="prose prose-lg prose-stone dark:prose-invert mx-auto font-serif">
        {storyText.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-6 text-xl leading-relaxed">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default StoryContent;
