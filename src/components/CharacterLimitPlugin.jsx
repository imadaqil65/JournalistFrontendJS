// CharacterLimitPlugin.jsx

export default function CharacterLimitPlugin(editor, maxLength) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return {
            upload() {
                return Promise.reject('Upload not supported');
            },
            abort() {
                // No need to implement
            }
        };
    };

    editor.model.schema.extend('$text', { allowAttributes: 'charLimit' });

    editor.conversion.attributeToElement({
        model: 'charLimit',
        view: (modelAttributeValue, { writer }) => {
            return writer.createAttributeElement('div', { class: 'char-limit' });
        }
    });

    editor.model.document.on('change:data', () => {
        const textLength = editor.getData().length;
        if (textLength > maxLength) {
            const diff = textLength - maxLength;
            editor.model.change(writer => {
                const changes = writer.model.document.deltas.slice(-diff);
                changes.forEach(delta => {
                    if (delta.type === 'insert' || delta.type === 'retain') {
                        writer.model.enqueueChange(writer => {
                            writer.model.deleteContent(delta.range);
                        });
                    }
                });
            });
        }
    });
}
