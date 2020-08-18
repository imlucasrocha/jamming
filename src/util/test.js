// THIS FILE IS LITERALLY TO JUST TEST STUFF 

const Test = {
    getUsername(){
        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
          }).then(response => {
            if(response.ok){
                return response.json();  
            }
              throw new Error('Request failed!');
          }, networkError => {
            console.log(networkError.message);
          }).then(jsonResponse => {
            console.log(jsonResponse);
          })
    }
}

export default Test; 
