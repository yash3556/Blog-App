import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'
import conf from '../conf/conf'

export default function RTE({ name, control, label, defaultValue = "", height = 500, width = 1000 }) {
  const apiKey = conf.tinymceApiKey || undefined

  return (
    <div>
      {label && <label>{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
         <Editor
          apiKey={apiKey}
          value={value}
          initialValue={defaultValue}
          init={{
            height: height,
            width: width,
            skin: "oxide-dark",
            content_css: "dark",           
            menubar:false,
            plugins:[
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
                        "help",
                         "wordcount",
                        ],
            toolbar:"undo redo | " +"formatselect fontfamily fontsize | " +"bold italic underline strikethrough | " +
                    "forecolor backcolor | " +"alignleft aligncenter alignright alignjustify | " +"bullist numlist outdent indent | " +
                    "link image media table | " +"removeformat code fullscreen preview | " +"help",
                    content_style: `body {  background-color: #0d1021;  color: white; font-family: sans-serif; padding: 20px;}
                        p { color: #e5e7eb;}`,
          }}
          onEditorChange={onChange} />
      )}
      />
    </div>
  )
}
