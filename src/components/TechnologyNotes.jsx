import './TechnologyNotes.css';

function TechnologyNotes({ notes, techId, onNotesChange }) {
  return (
    <div className="notes-section">
      <h4>📝 Мои заметки:</h4>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(techId, e.target.value)}
        placeholder="Записывайте сюда важные моменты, идеи, ссылки..."
        rows="3"
        className="notes-textarea"
      />
      <div className="notes-hint">
        {notes.length > 0 
          ? `Заметка сохранена (${notes.length} символов)` 
          : 'Добавьте заметку по этой технологии'
        }
      </div>
    </div>
  );
}

export default TechnologyNotes;