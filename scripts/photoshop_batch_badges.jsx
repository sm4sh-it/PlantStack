#target photoshop

/**
 * PlantStack - Photoshop AI Batch Background Removal & Badge Optimizer
 * 
 * Verwendung in Photoshop:
 * 1. Datei -> Skripte -> Durchsuchen... (File -> Scripts -> Browse...)
 * 2. Diese Datei (photoshop_batch_badges.jsx) auswählen.
 * 3. Quellordner wählen: '_work/badges_raw'
 * 4. Zielordner wählen: z.B. '_work/photoshop_out' oder direkt 'public/images/badges'
 * 
 * Funktionsweise:
 * - Öffnet jedes Badge nacheinander
 * - Führt Adobe Sensei AI "Hintergrund entfernen" (bzw. "Motiv auswählen" + Maske) aus
 * - Schneidet überflüssige transparente Ränder pixelgenau ab (Trim)
 * - Skaliert proportional auf 480px und zentriert auf 512x512 Canvas (16px Breathing Room)
 * - Speichert verlustfrei als transparentes PNG (oder WebP)
 */

(function () {
    app.bringToFront();

    // 1. Ordner-Auswahl
    var inputFolder = Folder.selectDialog("1/2: Wähle den Quellordner mit den Rohbildern (z.B. _work/badges_raw):");
    if (!inputFolder) return;

    var outputFolder = Folder.selectDialog("2/2: Wähle den Zielordner für freigestellte Badges:");
    if (!outputFolder) return;

    var files = inputFolder.getFiles(/\.(png|jpe?g|webp|tif?f)$/i);
    if (files.length === 0) {
        alert("Keine Bilddateien im Quellordner gefunden!");
        return;
    }

    var originalDialogMode = app.displayDialogs;
    app.displayDialogs = DialogModes.NO;

    var successCount = 0;
    var errorList = [];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var doc = null;

        try {
            doc = app.open(file);

            // A. Hintergrundebene in Standardebene umwandeln
            if (doc.activeLayer.isBackgroundLayer) {
                doc.activeLayer.name = "Badge";
            }

            // B. Freistellung via Adobe AI
            var cutoutDone = false;

            // Versuch 1: Photoshop Schnellaktion "Hintergrund entfernen" (removeBackground)
            try {
                var desc = new ActionDescriptor();
                executeAction(stringIDToTypeID("removeBackground"), desc, DialogModes.NO);
                cutoutDone = true;
            } catch (e1) {
                cutoutDone = false;
            }

            // Versuch 2: Fallback auf "Motiv auswählen" (autoCutout / Select Subject)
            if (!cutoutDone) {
                try {
                    var descSelect = new ActionDescriptor();
                    descSelect.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
                    executeAction(stringIDToTypeID("autoCutout"), descSelect, DialogModes.NO);

                    // Auswahl umkehren und Hintergrund/Schatten löschen
                    doc.selection.invert();
                    doc.selection.clear();
                    doc.selection.deselect();
                    cutoutDone = true;
                } catch (e2) {
                    throw new Error("Weder 'removeBackground' noch 'autoCutout' verfügbar.");
                }
            }

            // C. Transparente Ränder exakt trimmen
            doc.trim(TrimType.TRANSPARENT, true, true, true, true);

            // D. Proportional auf 480px einpassen und auf 512x512 Canvas zentrieren
            var currentW = doc.width.as("px");
            var currentH = doc.height.as("px");
            var maxDim = Math.max(currentW, currentH);
            var scale = 480.0 / maxDim;

            var targetW = Math.max(1, Math.round(currentW * scale));
            var targetH = Math.max(1, Math.round(currentH * scale));

            doc.resizeImage(UnitValue(targetW, "px"), UnitValue(targetH, "px"), null, ResampleMethod.BICUBICAUTOMATIC);
            doc.resizeCanvas(UnitValue(512, "px"), UnitValue(512, "px"), AnchorPosition.MIDDLECENTER);

            // E. Speichern als transparentes PNG
            var baseName = file.name.replace(/\.[^\.]+$/, "");
            var saveFile = new File(outputFolder + "/" + baseName + ".png");

            var pngOpts = new PNGSaveOptions();
            pngOpts.compression = 8;
            pngOpts.interlaced = false;

            doc.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);
            doc.close(SaveOptions.DONOTSAVECHANGES);
            successCount++;

        } catch (err) {
            errorList.push(file.name + ": " + err.message);
            if (doc) {
                try { doc.close(SaveOptions.DONOTSAVECHANGES); } catch (e) {}
            }
        }
    }

    app.displayDialogs = originalDialogMode;

    if (errorList.length === 0) {
        alert("Erfolg! Alle " + successCount + " Badges wurden mit Adobe AI freigestellt, zentriert und als PNG gespeichert.\n\nDu kannst sie nun mit 'npm run process-badges' in WebP konvertieren!");
    } else {
        alert("Fertig mit " + successCount + " Erfolgen und " + errorList.length + " Fehlern:\n" + errorList.join("\n"));
    }
})();
