/** Tema de resaltado propio, con la paleta del sitio. */
export const codeTheme = {
  name: 'noche-andina',
  type: 'dark' as const,
  colors: { 'editor.background': '#060b20', 'editor.foreground': '#dbe2ff' },
  settings: [
    { settings: { foreground: '#dbe2ff', background: '#060b20' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7d89b8', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new'], settings: { foreground: '#c39bff' } },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#4fd1a0' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#ffb36b' } },
    { scope: ['entity.name.function', 'meta.method.identifier', 'support.function'], settings: { foreground: '#f5b83d' } },
    { scope: ['entity.name.type', 'support.class', 'entity.name.class', 'storage.type.java', 'storage.type.generic', 'storage.type.object.array.java'], settings: { foreground: '#8fb0ff' } },
    { scope: ['storage.type.annotation', 'punctuation.definition.annotation', 'meta.declaration.annotation'], settings: { foreground: '#f5b83d' } },
    { scope: ['variable.parameter', 'variable.other'], settings: { foreground: '#dbe2ff' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#a8b8ff' } },
  ],
};
