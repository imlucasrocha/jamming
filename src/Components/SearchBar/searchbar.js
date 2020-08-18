import React from 'react'; 
import './searchbar.css';

class SearchBar extends React.Component {    
    constructor(props){
        super(props);
        this.state = {
            term: " "
        };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    
    handleTermChange(event){
        this.setState({term: event.target.value});
        //console.log(this.state.term); // I wonder why does it have to be this way - why can't I just attach the value of the element directly into the response?
    }

    search(){
        this.props.onSearch(this.state.term);
        console.log("searching for", this.state.term);
    }
    
    render(){
        return (
            <div className='SearchBar'> 
                <input 
                    placeholder="Enter a Song, Album, or Artist" 
                    onChange={this.handleTermChange}
                    />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        );
    }
}

export default SearchBar;