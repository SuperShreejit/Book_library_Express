// filepond plugins being initiated on the body by attaching a class 'filepond' onto a input file element for processing
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({
    stylePanelAspectRatio: 3 / 2,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150,
  })
  
  FilePond.parse(document.body)  

