"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import SignupPage from "@/app/signup/page";
import LoginPage from "@/app/login/page";

import {
  SlLocationPin,
  SlStar,
  SlMusicToneAlt,
  SlClock,
  SlControlPlay,
  SlCalender,
  SlHeart,
} from "react-icons/sl";
import { GiHearts } from "react-icons/gi";

import { HiOutlineArrowRight } from "react-icons/hi";
import BreadcrumbComp from "@/app/components/breadCrumbs/page";

interface ConcertSingle {
  _id: string;
  concert_artist: {
    artist_id: string;
    artist_name: string;
    artist_instagram: string;
    artist_youtube: string;
    artist_facebook: string;
    artist_twitter: string;
    artist_spotify: string;
  };
  concert_date: string;
  concert_description: string;
  concert_image: string;
  concert_name: string;
  concert_start: string;
  concert_genre: {
    genre_id: string;
    genre_name: string;
  };
  concert_venue: {
    venue_id: string;
    venue_name: string;
    venue_address: string;
    venue_location: string;
  };
  concert_doors: string;
}

const SingleConcert: React.FC = () => {
  const [userData, setUserData] = useState<string | null>(null);
  const [favouriteUserId, setFavouriteUserId] = useState("");
  const [data, setData] = useState("Loading");

  const [loading, setLoading] = useState(false);

  const deleteFavourite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedConcert) {
      setLoading(false); // Set loading to false if there's no selected concert
      return;
    }

    const data = new FormData();
    data.set("Favourite_user_id", userData || "");
    data.set("Favourite_concert_id", selectedConcert._id);

    try {
      const res = await fetch("/api/data/deleteFavourite/", {
        method: "DELETE",
        body: data,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(errorText);
        // Handle the error here, e.g., show an error message to the user
      } else {
        // Handle success case
        setLoading(false);
        deletedFromFavourites();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle any unexpected errors here
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const frm = event?.target;
    e.preventDefault();
    setLoading(true);

    if (!selectedConcert) {
      return;
    }

    const data = new FormData();
    data.set("Favourite_concert_id", selectedConcert._id);
    data.set("Favourite_concert_image", selectedConcert.concert_image);
    data.set("Favourite_concert_name", selectedConcert.concert_name);
    data.set("Favourite_concert_date", selectedConcert.concert_date);
    data.set(
      "Favourite_concert_artist",
      selectedConcert.concert_artist?.artist_name
    );
    data.set("Favourite_user_id", userData || "");

    const res = await fetch("/api/data/addFavourite/", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(errorText);
    }

    if (res.ok) {
      setLoading(false);
      addedToFavouritesMessage();
    }
  };

  const addedToFavouritesMessage = () => {
    const notAddedToFavourites = document.getElementById(
      "notAddedToFavourites"
    );
    const addedToFavourites = document.getElementById("addedToFavourites");

    addedToFavourites?.classList.remove("hidden");
    addedToFavourites?.classList.add("flex");
    notAddedToFavourites?.classList.add("hidden");
  };

  const deletedFromFavourites = () => {
    const notAddedToFavourites = document.getElementById(
      "notAddedToFavourites"
    );
    const addedToFavourites = document.getElementById("addedToFavourites");

    addedToFavourites?.classList.add("hidden");
    addedToFavourites?.classList.remove("flex");
    notAddedToFavourites?.classList.remove("hidden");
  };

  const params = useParams();
  const id = params.id;
  const [concerts, setConcerts] = useState<ConcertSingle[]>([]);
  const [selectedConcert, setSelectedConcert] = useState<ConcertSingle | null>(
    null
  );

  // Fetch data with useEffect because it is a client site
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/data/concertData");
        setConcerts(response.data.data);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchData();
  }, []);

  // Get User Cookie
  const getUserDetails = async () => {
    const res = await axios.get("/api/users/cookieUser");
    console.log(res.data);
    setUserData(res.data.data._id);
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    getUserDetails();
  }, []);

  // Use a useEffect to update the selectedConcert when the 'id' or 'concerts' array changes
  useEffect(() => {
    if (id && concerts.length > 0) {
      const matchingConcert = concerts.find((concert) => concert._id === id);
      setSelectedConcert(matchingConcert || null);
    } else {
      setSelectedConcert(null);
    }
  }, [id, concerts]);

  return (
    <div>
      <LoginPage />
      <SignupPage />
      <BreadcrumbComp />
      {selectedConcert ? (
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <figure>
            <Image
              src={`https://concertify.s3.eu-central-1.amazonaws.com/${selectedConcert.concert_image}`}
              width={200}
              height={200}
              alt="concert"
              className="h-auto w-full rounded-lg"
            />
          </figure>
          <section>
            <div className="flex md:justify-between">
              <h1 className="text-3xl font-bold my-2">
                {selectedConcert.concert_name}
              </h1>
              <form
                id="notAddedToFavourites"
                className="flex flex-col items-center gap-8 pb-12"
                onSubmit={onSubmit}
              >
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_concert_id"
                  value={selectedConcert._id}
                />
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_concert_image"
                  value={selectedConcert.concert_image}
                />
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_concert_name"
                  value={selectedConcert.concert_name}
                />
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_concert_date"
                  value={selectedConcert.concert_date}
                />
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_concert_artist"
                  value={selectedConcert.concert_artist.artist_name}
                />
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_user_id"
                  value={data}
                />

                <button
                  className="flex items-center place-content-center rounded-full bg-purple-100 brand_purple w-10 h-10  hover:bg-purple-200"
                  type="submit"
                  value="upload"
                >
                  <SlHeart
                    className="stroke-[#5311BF] dark:stroke-[#8e0bf5] w-5 h-5"
                    id="favourites"
                  />
                </button>
              </form>

              <form
                id="addedToFavourites"
                className="hidden flex-col items-center gap-8 pb-12"
                onSubmit={deleteFavourite}
              >
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_concert_id"
                  value={selectedConcert._id}
                />
                <input
                  readOnly={true}
                  className="bg-slate-100 p-4 w-72 hidden"
                  type="text"
                  name="Favourite_user_id"
                  value={data}
                />

                <button
                  className="flex items-center place-content-center rounded-full bg-purple-100 brand_purple w-10 h-10  hover:bg-purple-200"
                  type="submit"
                  value="upload"
                >
                  <GiHearts
                    className="stroke-[#5311BF] dark:stroke-[#8e0bf5] w-5 h-5"
                    id="favourites"
                  />
                </button>
              </form>
            </div>

            <ul className="flex flex-col gap-4">
              {/* Concert genre tag*/}
              <li className="flex gap-2">
                <SlMusicToneAlt
                  className="stroke-gray-600 dark:stroke-slate-400 w-5 h-5"
                  id="genre"
                />
                <p className="text-gray-600 dark:text-slate-400 text-sm align-middle">
                  {selectedConcert.concert_genre.genre_name}
                </p>
              </li>

              {/* More about the artist*/}
              <Link
                href={"/artists/" + selectedConcert.concert_artist.artist_id}
                key={selectedConcert.concert_artist.artist_id}
              >
                <li className="flex gap-2">
                  <SlStar
                    className="fill-[#5311BF] dark:fill-[#8e0bf5] w-5 h-5"
                    id="artist"
                  />
                  <p className="text-[#5311BF] dark:text-[#8e0bf5] text-sm align-middle">
                    Read more about {selectedConcert.concert_artist.artist_name}
                  </p>
                </li>
              </Link>

              {/* Concert date*/}
              <li className="flex gap-2">
                <SlCalender
                  className="stroke-gray-600 dark:stroke-slate-400 w-5 h-5"
                  id="date"
                />
                <p className="text-gray-600 dark:text-slate-400 align-middle">
                  {selectedConcert.concert_date}
                </p>
              </li>

              {/* Doors open*/}
              <li className="flex gap-2">
                <SlClock
                  className="stroke-gray-600 dark:stroke-slate-400 w-5 h-5"
                  id="doors"
                />
                <p className="text-gray-600 text-sm dark:text-gray-400 align-middle">
                  Doors open: {selectedConcert.concert_doors}
                </p>
              </li>

              {/* Concert start*/}
              <li className="flex gap-2">
                <SlControlPlay
                  className="stroke-gray-600 dark:stroke-slate-400 w-5 h-5"
                  id="concert_start"
                />
                <p className="text-gray-600 text-sm dark:text-gray-400 align-middle">
                  Concert start: {selectedConcert.concert_start}
                </p>
              </li>

              {/* Location*/}
              <li className="flex gap-2">
                <SlLocationPin
                  className="stroke-gray-600 dark:stroke-slate-400 w-5 h-5"
                  id="location"
                />
                <p className="text-gray-600 text-sm dark:text-gray-400 align-middle">
                  {selectedConcert.concert_venue.venue_name}
                </p>
              </li>

              {/* See all concerts*/}
              <li className="flex gap-2">
                <Link className="flex gap-2" href="/concerts/">
                  <HiOutlineArrowRight
                    className="stroke-[#5311BF] dark:stroke-[#8e0bf5] w-5 h-5"
                    id="se_all"
                  />
                  <p className="text-[#5311BF] dark:text-[#8e0bf5] text-sm align-middle">
                    See all concerts
                  </p>
                </Link>
              </li>
            </ul>

            <div className="border-t-[1px] border-[#979C9E] pt-4 mt-4">
              <p className="text-gray-600 text-sm dark:text-gray-400 align-middle">
                {selectedConcert.concert_description}
              </p>
            </div>
          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SingleConcert;
