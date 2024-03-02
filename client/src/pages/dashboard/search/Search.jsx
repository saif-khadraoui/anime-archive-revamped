import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/search/search.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { MdOutlineSearch } from "react-icons/md";
import Axios from "axios"
import { CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate, useLocation } from 'react-router-dom';

function Search() {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  const [animes, setAnimes] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const animePath = "/dashboard/searchAnime"
  const mangaPath = "/dashboard/searchManga"
  const type = pathname == mangaPath ? "manga" : "anime" 

  // useEffect(() => {
  //   setAnimes([])
  // }, [])

  const enterSearch = async (event) => {
    if (event.key == "Enter"){
      await attemptSearch(search)
    }
  }

  const attemptSearch = (query) => {
    setLoading(true)
    setAnimes([])
    console.log(query)

    const fetchAnimes = async () => {
      await Axios.get(`https://api.jikan.moe/v4/${type}?q=${query}&limit=10`).then((response) => {
        console.log(response)
        if(response.data.data.length > 0){
          setAnimes(response.data.data)
        } else{
          alert("no animes were found")
          setLoading(false)
        }
        
        // setLoading(false)
      })
    }

    fetchAnimes()
  }

  // useEffect(() => {
  //   console.log(search)
  // }, [attemptSearch])

  const routeAnime = (animeId) => {
    navigate(`/dashboard/${type}/${animeId}`)
  }



  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.search}>
        <div className={styles.searchContainer}>
          <div className={styles.filterLetter}>
            {letters.map((letter) => {
              return <p onClick={() => attemptSearch(letter)}>{letter}</p>
            })}
          </div>
          <div className={styles.searchInput}>
            <input type="text" placeholder='search anime' value={search} onChange={((e) => setSearch(e.target.value))} onKeyDown={enterSearch}/>
            <MdOutlineSearch style={{ color: "black", width: "25px", height: "25px", flex: 1, cursor: "pointer" }} onClick={() => attemptSearch(search)}/>
          </div>
        </div>
        <div className={styles.result}>
          {loading ? (
            <>
            {animes.length > 0 ? (
              <>
                {animes.map((anime, idx) => {
                  return (
                    <div className={styles.animeItem} onClick={() => routeAnime(anime.mal_id)}>
                      <img src={anime.images?.jpg?.image_url} alt=""/>
                      <p>{anime.title}</p>
                    </div>
                  )
                  })}
                  </>
                ) : (
                  <SyncLoader color="red" />
                  
              )}
            
            </>
          ) : (
            <>
            {pathname == mangaPath ? (
              <p style={{ color: "white" }}>Search a manga up</p>
            ) : (
              <p style={{ color: "white" }}>Search an anime up</p>
            )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default Search