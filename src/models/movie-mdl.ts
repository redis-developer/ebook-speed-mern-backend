import type { CstDocumentType } from "../utils/mongodb/generic-database.types";

interface IRangeNumber {
    low: number;
    high: number;
}

interface IMovie extends CstDocumentType {
    movieId?: string;

    title: string;
    tagline: string;
    plot: string;

    poster?: string;
    url?: string;
    released: string | Date | null;
    year?: IRangeNumber;
    duration: number;

    languages: string[] | null;
    countries: string[] | null;

    imdbRating?: number;
    // imdbId?: string;
    // imdbVotes?: IRangeNumber;

    // budget?: IRangeNumber;
    // revenue?: IRangeNumber;

}


/** 
const sample = {
    movieId: "1",

    title: "Toy Story",
    tagline: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",

    poster: "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    url: "https://themoviedb.org/movie/862",
    released: "1995-11-22",
    year: { low: 1995, high: 0 },
    duration: 81,

    languages: ["English"],
    countries: ["USA"],

    imdbId: "0114709",
    imdbRating: 8.3,
    imdbVotes: { low: 591836, high: 0 },

    budget: { low: 30000000, high: 0 },
    revenue: { low: 373554033, high: 0 },
};
*/

export type {
    IMovie
};

