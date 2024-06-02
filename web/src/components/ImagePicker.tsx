'use client'

import { ChangeEvent, useState } from 'react'

export default function ImagePicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target
    if (!files) {
      return
    }

    const previewUrl = URL.createObjectURL(files[0])

    setPreview(previewUrl)
  }

  return (
    <>
      <input
       type="file" onChange={onFileSelected} name="capa"
       accept="image/*" id="capa" className="invisible" />
      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-52 h-48 rounded-lg object-cover"
        />
      )}
    </>
  )
}
