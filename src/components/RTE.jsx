import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';


export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full'>
      {label && <label className='flex mb-1 pl-1 justify-start'>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey='x2sfg5xenjky35wh4yk3nlrvru0yxwahi6z3ru30ppx5c2oy'
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 200,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
          />
        )}
      />

    </div>
  )
}

