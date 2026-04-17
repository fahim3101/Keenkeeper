import { useContext, useState } from 'react';
import { TimelineContext } from '../context/TimelineContext';

export default function Timeline() {
  const { timelineEntries } = useContext(TimelineContext);
  const [filter, setFilter] = useState('All');

  const filteredEntries = filter === 'All' 
    ? timelineEntries 
    : timelineEntries.filter(entry => entry.type === filter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Timeline</h2>
        <select onChange={(e) => setFilter(e.target.value)} className="border px-3 py-1 rounded-md">
          <option value="All">All Interactions</option>
          <option value="Call">Calls</option>
          <option value="Text">Texts</option>
          <option value="Video">Videos</option>
        </select>
      </div>
      
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {filteredEntries.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No interactions yet.</p>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-gray-50">
              <img src={`/assets/${entry.type.toLowerCase()}.png`} alt={entry.type} className="w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm">{entry.title}</h4>
                <p className="text-xs text-gray-500">{entry.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}