import React, { useState, useEffect } from "react";
import { updateService } from "../../services/supabase";

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [featuredUpdates, setFeaturedUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const [allUpdates, featured] = await Promise.all([
        updateService.getAllUpdates(),
        updateService.getFeaturedUpdates(3)
      ]);
      setUpdates(allUpdates);
      setFeaturedUpdates(featured);
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'feature': return '✨';
      case 'bug-fix': return '🔧';
      case 'security': return '🛡️';
      case 'performance': return '⚡';
      case 'ui-update': return '🎨';
      case 'maintenance': return '🔧';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 mt-12 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🎮 Game Updates & Announcements
        </h1>

        {/* Featured Updates Section */}
        {featuredUpdates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">⭐ Featured Updates</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredUpdates.map((update) => (
                <div key={update.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{getCategoryIcon(update.category)}</span>
                    <h3 className="text-lg font-bold text-purple-300">{update.title}</h3>
                  </div>
                  {update.version && (
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full font-medium">
                        {update.version}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">{update.content}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>by {update.author_name}</span>
                    <span>{new Date(update.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Updates Timeline */}
        <div className="relative border-l border-gray-700 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-blue-400">📋 All Updates</h2>
          
          {updates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No updates available yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for the latest game updates and announcements.</p>
            </div>
          ) : (
            updates.map((update, idx) => (
              <div key={update.id} className="mb-10 ml-6">
                {/* Timeline Dot */}
                <div className={`absolute w-4 h-4 rounded-full mt-2.5 -left-2 border-2 border-gray-950 ${
                  update.is_featured ? 'bg-purple-500' :
                  update.priority === 'critical' ? 'bg-red-500' :
                  update.priority === 'high' ? 'bg-orange-500' :
                  update.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></div>

                {/* Update Card */}
                <div className={`bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition border ${
                  update.is_featured ? 'border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-gray-900' :
                  'border-gray-700'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(update.category)}</span>
                      <div>
                        <h2 className="text-xl font-semibold text-blue-400">
                          {update.title}
                        </h2>
                        {update.version && (
                          <span className="text-sm text-blue-300">
                            {update.version}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border mb-2 ${getPriorityColor(update.priority)}`}>
                        {update.priority.toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(update.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {update.author_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-400">by {update.author_name}</span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                      {update.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {update.is_featured && (
                      <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{update.content}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Created: {new Date(update.created_at).toLocaleString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {update.updated_at !== update.created_at && (
                      <span>
                        Updated: {new Date(update.updated_at).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
