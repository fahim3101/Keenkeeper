import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TimelineContext } from '../context/TimelineContext';

export default function FriendDetails() {
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const { addInteraction } = useContext(TimelineContext);

  useEffect(() => {
    fetch('/friends.json')
      .then(res => res.json())
      .then(data => setFriend(data.find(f => f.id === parseInt(id))));
  }, [id]);

  const handleInteraction = (type) => {
    addInteraction(type, friend.name);
    toast.success(`${type} logged successfully!`);
  };

  if (!friend) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        {/* Left Column */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-center">
          <img src={friend.picture} alt={friend.name} className="w-24 h-24 rounded-full mb-4" />
          <h2 className="text-2xl font-bold">{friend.name}</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium mt-2 ${
                 friend.status === 'overdue' ? 'bg-red-100 text-red-600' : 
                 friend.status === 'on-track' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
               }`}>{friend.status.toUpperCase()}</span>
          <p className="text-gray-500 mt-4 text-sm text-center">{friend.bio}</p>
          <p className="text-gray-400 text-xs mt-2">{friend.email}</p>
          
          <div className="w-full mt-6 space-y-2">
            <button className="w-full border py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">⏰ Snooze 2 Weeks</button>
            <button className="w-full border py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">📦 Archive</button>
            <button className="w-full border py-2 rounded-md font-medium text-red-500 hover:bg-red-50">🗑️ Delete</button>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border text-center"><h3 className="font-bold text-xl">{friend.days_since_contact}</h3><p className="text-xs text-gray-500">Days Since Contact</p></div>
            <div className="bg-white p-4 rounded-xl border text-center"><h3 className="font-bold text-xl">{friend.goal}</h3><p className="text-xs text-gray-500">Goal Days</p></div>
            <div className="bg-white p-4 rounded-xl border text-center"><h3 className="font-bold text-xl">{friend.next_due_date}</h3><p className="text-xs text-gray-500">Next Due Date</p></div>
          </div>

          <div className="bg-white p-6 rounded-xl border flex justify-between items-center">
             <div>
               <h4 className="font-bold text-gray-700">Relationship Goal</h4>
               <p className="text-sm text-gray-500">Contact every {friend.goal} days</p>
             </div>
             <button className="text-sm font-medium border px-4 py-1 rounded-md">Edit</button>
          </div>

          <div className="bg-white p-6 rounded-xl border">
             <h4 className="font-bold text-gray-700 mb-4">Quick Check-In</h4>
             <div className="flex gap-4">
               <button onClick={() => handleInteraction('Call')} className="flex-1 flex flex-col items-center justify-center border py-4 rounded-xl hover:bg-gray-50 transition">
                 <img src="/assets/call.png" alt="Call" className="h-8 mb-2" /> Call
               </button>
               <button onClick={() => handleInteraction('Text')} className="flex-1 flex flex-col items-center justify-center border py-4 rounded-xl hover:bg-gray-50 transition">
                 <img src="/assets/text.png" alt="Text" className="h-8 mb-2" /> Text
               </button>
               <button onClick={() => handleInteraction('Video')} className="flex-1 flex flex-col items-center justify-center border py-4 rounded-xl hover:bg-gray-50 transition">
                 <img src="/assets/video.png" alt="Video" className="h-8 mb-2" /> Video
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}