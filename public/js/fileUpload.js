// File di configurazione di FilePond

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: /* 150 / 100 */0.75,
    // nel database le immagini verranno salvate con queste dimensioni
    imageresizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

FilePond.parse(document.body);