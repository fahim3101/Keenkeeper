import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch('/friends.json')
      .then(res => res.json())
      .then(data => setFriends(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Friends to keep close in your life</h1>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto text-lg">
          Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
        </p>
        <button className="bg-[#214f3b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition shadow-md">
          + Add a Friend
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
          <h2 className="text-4xl font-bold">12</h2>
          <p className="text-gray-500 font-medium mt-2">Total Friends</p>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
          <h2 className="text-4xl font-bold text-red-500">3</h2>
          <p className="text-gray-500 font-medium mt-2">Overdue</p>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
          <h2 className="text-4xl font-bold text-green-600">6</h2>
          <p className="text-gray-500 font-medium mt-2">On Track</p>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-sm">
          <h2 className="text-4xl font-bold text-[#214f3b]">15</h2>
          <p className="text-gray-500 font-medium mt-2">Interactions This Month</p>
        </div>
      </div>

      {/*Friends Section */}
      <div className="mb-10 text-left">
        <h3 className="text-2xl font-bold mb-8 text-gray-800">Your Friends</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {friends.map(friend => (
            <Link 
              to={`/friend/${friend.id}`} 
              key={friend.id} 
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <img 
                src={friend.picture} 
                alt={friend.name} 
                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-50" 
              />
              <h4 className="font-bold text-xl text-gray-900">{friend.name}</h4>
              <p className="text-gray-400 font-medium mb-3">{friend.days_since_contact} Days since contact</p>
              
              <div className="flex gap-2 mb-5 flex-wrap justify-center">
                {friend.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <span className={`text-[11px] font-black uppercase tracking-[2px] px-6 py-2 rounded-full ${
                friend.status === 'overdue' ? 'bg-red-50 text-red-600' : 
                friend.status === 'on-track' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {friend.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}