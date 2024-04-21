
import React, { useState ,FormEvent} from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import starry from "../../images/business-8256831.jpg";
// import { makeStyles } from '@mui/styles';
import Header from '../../Header/header';

function Home() {
  // const classes = useStyles();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState(null);
  const [symbols, setSymbols] = useState([]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setCsvFile(selectedFile);
    }
  };
  console.log(csvFile)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!csvFile) {
      console.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      // const csrfToken = getCookie('csrftoken');
      const response = await fetch('http://127.0.0.1:8000/playground/predict/', {
        method: 'POST',
        body: formData,
      });
      
      const jsonResponse = await response.json();
      const symbolsArray = JSON.parse(jsonResponse.symbols);

      // Set symbols in state
      setSymbols(symbolsArray);

      console.log('File uploaded successfully');
      console.log(symbolsArray);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (

    <div>

      <div className="Home" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundImage: `url(${starry})`, backgroundSize: 'cover', height: '75vh', width: '99.2vw', color: 'white', backgroundPosition: 'center center' }}>
          <Container style={{ marginTop: "25vh" }}>
            <Typography variant="h2" component="h1" align="center" gutterBottom>
              Welcome to TradeMate
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              This website gives you suggestions for your next possible investments ^_^
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              Give us a Thumbs up if we helped you a little
            </Typography>
            <div className="learn-btn" style={{ marginTop: "50px" }} >
              <center> <Button variant="contained" color="primary" size="large">
                Learn more
              </Button></center></div>
          </Container>
        </div>

        <div className="main-content" style={{ display: 'flex', background: '#100b22', color: 'white' }}>
          <div style={{ width: '25%', overflowY: 'auto', marginTop: '50px' }}>
            <Container>
              {/* <Typography variant="h5" component="h2" align="center" gutterBottom>
            Search
          </Typography> */}
              <TextField label="Search" variant="outlined" fullWidth InputLabelProps={{ style: { color: 'white' } }} inputProps={{ style: { color: 'white', border: '1px solid white' } }} />
              <Typography variant="h4" component="h2" align="center" gutterBottom style={{ margin: '20px 0' }}>
                Trending Stocks
              </Typography>
              <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', textAlign: 'left', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <Typography variant="body1" gutterBottom
                // style={{ backgroundColor: 'white', padding: '8px 15px', borderRadius: '4px', display: 'inline-block',color:'black' }}
                >
                  Tata Steels
                </Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Hero Motocorp</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Tata Steels</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Hero Motocorp</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Tata Steels</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Hero Motocorp</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Tata Steels</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Hero Motocorp</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Tata Steels</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Hero Motocorp</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Tata Steels</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Hero Motocorp</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Tata Steels</Typography>
                <hr />


              </div>
            </Container>
          </div>

          <div style={{ width: '70%', maxHeight: 'calc(1000vh-200px)', overflowY: 'auto' }}>
            <Container>
              <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', justifyContent: 'center' }}>
                <input
                  type="file"
                  accept=".csv"
                  id="fileInput"
                  onChange={handleFileChange}
                  style={{ margin: '45px 0 0 0', padding: '5% 0 5% 17%', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                {csvFile ? <Button type="submit" style={{ border: ' 1px solid white', margin: '15px 10% 0px 22%', padding: '10px', width: '50%' }}>Get Prediction</Button> : <p style={{ margin: '15px  0 0 0' }}>Please Select CSV File</p>}
              </div>

              </form>
              {symbols.length>0 && (
                <div>
                  <h3>Symbols:</h3>
                  <ul>
                    {symbols.map((symbol, index) => (
                      <li key={index}>{symbol}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ display: 'block',textAlign: 'left',width:'100%'}}>
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
                <Typography variant="body1" gutterBottom>Adani Power</Typography>
                <hr />
              </div>
              {/* <Grid container spacing={3} style={{ margin: '20px 0', justifyContent: 'center' }}>
                <Grid item xs={14} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        Your Holdings
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        This Tab shows your holdings here in which you have invested for the past few days and their stats
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        Current Stocks
                      </Typography>
                      <center> <Typography variant="body2" color="textSecondary">
                        This Tab shows the current Stocks in the market in which you would like to invest
                      </Typography></center>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid> */}
              <Typography variant="body1" align="left" paragraph>
                {/* Give us a Thumbs up if we helped you a little Lorem ipsum dolor */}

              </Typography>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
// const getCookie = (name) => {
//   const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
//   return cookieValue ? cookieValue.pop() : '';
// };

export default Home;
