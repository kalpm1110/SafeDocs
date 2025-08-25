'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { useDoc } from '@/app/hooks/DocContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function DocPage() {
  const { user, isLoading } = useKindeAuth();
  const { docid } = useParams();
  const  doc  = useDoc();
  const [content, setContent] = useState(doc.content || '');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;

    const userName = user?.given_name || `Guest_${Math.random().toString(36).slice(2, 7)}`;
    setUsername(userName);

    socketRef.current = io(process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:8080', {
      withCredentials: true,
    });

    socketRef.current.emit('join-doc', { docid, username: userName });

    socketRef.current.on('user-joined', ({ username }) => {
      if (username) {
        setUsers((prev) => [...new Set([...prev, username])]);
      }
    });

    socketRef.current.on('receive-update', (newContent) => {
      setContent(newContent);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [docid, user, isLoading]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socketRef.current.emit('doc-update', { docid, content: newContent });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-100">
              Document: {docid}
            </CardTitle>
            <p className="text-sm text-gray-400">
              Editing as: {username || <Loader2 className="inline animate-spin h-4 w-4" />}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Connected Users</h3>
              <div className="flex flex-wrap gap-2">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
                    >
                      {user}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    {isLoading ? 'Loading users...' : 'No other users connected'}
                  </p>
                )}
              </div>
            </div>
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start editing..."
              className="w-full h-96 bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-y"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="mt-4 flex items-center gap-2 text-gray-400">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Loading document...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}