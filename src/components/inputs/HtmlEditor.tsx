import React from 'react';
import dynamic from 'next/dynamic';

interface HtmlEditorProps {
  value: string;
  setValue: (value: string) => void;
  id?: string;
  className?: string;
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    // eslint-disable-next-line react/display-name
    return ({ ...props }) => <RQ {...props} />;
  },
  {
    ssr: false,
  }
);

export const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, setValue, id, className }) => {
  const handleChange = (newContent: string) => {
    setValue(newContent);
  };

  const modules = {
    toolbar: [[{ header: [2, 3, 4, false] }], ['bold', 'italic', 'underline', 'strike'], ['link', 'image']],
  };

  return (
    <div id={id} className={`rounded-xl border border-gray-200 bg-white outline-none ${className}`}>
      {React.createElement(ReactQuill, {
        onChange: handleChange,
        modules,
        value,
      })}
    </div>
  );
};
