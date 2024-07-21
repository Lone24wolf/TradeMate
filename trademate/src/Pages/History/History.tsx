import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import StockChart from '../Home/StockChart';
interface User {
  _id: string;
  id: number;
  email: string;
  date: string;
  time: string;
  csv_file: string;
  stock_symbols: string[];
}

interface UserHistoryContainerProps {
  user: User;
  index: number;
  onClick: (user: User) => void;
}

const UserHistoryContainer: React.FC<UserHistoryContainerProps> = ({ user, index, onClick }) => {
  const fileName = user.csv_file.split('/').pop();
  // const filename = fileName.split('_')

  return (
    <div
      style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', textAlign: 'left', cursor: 'pointer' }}
      onClick={() => onClick(user)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <a href={`http://127.0.0.1:8000/media/${user.csv_file}`} download={fileName} style={{ color: '#100b22', fontSize: '18px' }}>
          {fileName}
        </a>
        <div style={{ display: 'grid' }}>
          <Typography variant="body1" gutterBottom style={{ color: '#100b22', fontSize: '13px' }}>
            Date: {user.date}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: '#100b22', fontSize: '13px' }}>
            Time: {user.time}
          </Typography>
        </div>
      </div>
      <hr style={{ color: '#100b22' }} />
    </div>
  );
};

const renderUserHistory: React.FC<{ history: User[], onClick: (user: User) => void }> = ({ history, onClick }) => {
  return (
    <>
      {history.map((user, index) => (
        <UserHistoryContainer key={index} user={user} index={index} onClick={onClick} />
      ))}
    </>
  );
};

function History() {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [history, setHistory] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/playground/history/', {
          method: 'POST',
          body: user.email,
        });
        const data = await response.json();
        setHistory(data);
        if (data.length > 0) {
          setSelectedUser(data[0]); 
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [user]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div>
      <div className="Home" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="main-content" style={{ display: 'flex', background: '#100b22', color: 'white', height: '100vh' }}>
          <div style={{ width: '25%', overflowY: 'auto', marginTop: '5px', background: 'white' }}>
            <Container>
              <Typography variant="h4" component="h2" align="center" gutterBottom style={{ margin: '20px 0', color: '#100b22' }}>
                History
              </Typography>
              {user ? renderUserHistory({ history, onClick: handleUserClick }) : <p>Please login to see your trademate history.</p>}
            </Container>
          </div>

          <div style={{ width: '70%', maxHeight: 'calc(1000vh-200px)', overflowY: 'auto' ,scrollbarWidth: 'none'}}>
            <Container>
              <Typography variant="body1" align="center" paragraph>
                {user ? (selectedUser ? (
                  <div >
                    <Typography variant="h5" component="h2" gutterBottom>
                      Stock Symbols for {user ? ' ' : selectedUser.csv_file.split('/').pop()}
                    </Typography>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px' }}>
                      {selectedUser.stock_symbols.map((ticker, index) => (
                        <StockChart key={index} ticker={ticker} />
                      ))}
                    </div>
                  </div>

                ) : (
                  'No history present'
                )):'Please login to see your trademate history'}
              </Typography>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
