import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Diseños.css';
import Navbar from './Navbar';

const DescripcionPelicula = () => {
    const { id } = useParams();
    const [descripcionPelicula, setDescripcionPelicula] = useState({});
    const [trailerKey, setTrailerKey] = useState('');

    const [peliculasIds, setPeliculasIds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [comentariosPorPelicula, setComentariosPorPelicula] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState('');

    const handleComentarioChange = (event) => {
        setNuevoComentario(event.target.value);
    };

    const handleComentarioSubmit = (event) => {
        event.preventDefault();
        const comentariosActualizados = comentariosPorPelicula[id] || [];
        const nuevoComentarioObj = { id: peliculasIds, peliculaId: id, texto: nuevoComentario };
        setComentariosPorPelicula({ ...comentariosPorPelicula, [id]: [...comentariosActualizados, nuevoComentarioObj] });
        setNuevoComentario('');
    };

    useEffect(() => {
        const fetchPeliculasIds = async () => {
            const apiKey = '2e86bc9495548e9a7b0206823c2fdc34';
            const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=es`);
            const data = await response.json();
            const ids = data.results.map(movie => movie.id);
            setPeliculasIds(ids);

            const currentIndex = ids.indexOf(Number(id));
            setCurrentIndex(currentIndex);
        };

        fetchPeliculasIds();
    }, [id]);

    useEffect(() => {
        const fetchDescripcionPelicula = async () => {
            const apiKey = '2e86bc9495548e9a7b0206823c2fdc34';
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es`);
            const data = await response.json();
            setDescripcionPelicula(data);

            const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=es`);
            const trailerData = await trailerResponse.json();

            const trailer = trailerData.results.find(video => video.type === 'Trailer');
            if (trailer) {
                setTrailerKey(trailer.key);
            }
        };

        fetchDescripcionPelicula();
    }, [id]);

    const getEstrellasDoradas = (calificacion) => {
        const estrellas = [];
        const calificacionRedondeada = Math.round(calificacion / 2);

        for (let i = 1; i <= 5; i++) {
            if (i <= calificacionRedondeada) {
                estrellas.push(<span key={i} className="icono-estrella-dorada">&#9733;</span>);
            } else {
                estrellas.push(<span key={i} className="icono-estrella">&#9734;</span>);
            }
        }

        return estrellas;
    };

    const comentariosPelicula = comentariosPorPelicula[id] || [];

    return (
        <div className="container mt-4 background_text">
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="imagen-container">
                        <img className="img-fluid centrado" src={`https://image.tmdb.org/t/p/w300${descripcionPelicula.poster_path}`} alt={descripcionPelicula.title} />
                    </div>
                </div>
                <div className="col-md-8 mb-4">
                    <div className='Back_text'>
                        <h1 className='nombre_pelicula'>{descripcionPelicula.title}</h1>
                        <p className="rating">Rating: {descripcionPelicula.vote_average} / 10 {descripcionPelicula.vote_average && getEstrellasDoradas(descripcionPelicula.vote_average)}</p>
                        <p className="lanzamiento">Fecha de lanzamiento: {descripcionPelicula.release_date}</p>
                        <p className="duracion">Duración: {descripcionPelicula.runtime} minutos</p>
                        <p className="generos">Géneros: {descripcionPelicula.genres && descripcionPelicula.genres.map(genre => genre.name).join(', ')}</p>
                        {trailerKey && (
                            <div className="trailer">
                                <iframe
                                    title="Trailer"
                                    width="100%"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <p className="descripcion">{descripcionPelicula.overview}</p>
                        <Navbar currentIndex={currentIndex} peliculasIds={peliculasIds} />
                    </div>
                </div>
            </div>

            <div className="comentarios-section">
                <h3>Comentarios ({comentariosPelicula.length})</h3>
                <form onSubmit={handleComentarioSubmit}>
                    <textarea
                        value={nuevoComentario}
                        onChange={handleComentarioChange}
                        placeholder="Escribe tu comentario aquí..."
                    />
                    <button type="submit">Comentar</button>
                </form>
                <ul>
                    {comentariosPelicula.map((comentario, index) => (
                        <li key={index}>{comentario.texto}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DescripcionPelicula;
