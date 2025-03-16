import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Select } from "../index";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import appwriteResult from "../../appwrite/result";
import appwriteService from "../../appwrite/config";
import { useDispatch, useSelector } from "react-redux";
import {
  setResults,
  addResult,
  updateResult,
  setGames,
} from "../../store/resultSlice";

const ResultForm = (result) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const results = useSelector((state) => state.result.results);

  const [allData, setAllData] = useState(null);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const { register, handleSubmit, watch, setValue, reset } = useForm();

  const gameName = watch("gameName");
  const formattedDate = formatDate(selectedDate);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameData, resultData] = await Promise.all([
          appwriteService.getGames(),
          appwriteResult.getResults(),
        ]);

        const resultsArray = resultData?.documents || [];
        const gamesArray = gameData?.documents || [];

        dispatch(setResults(resultsArray));
        dispatch(setGames(gamesArray));

        setAllData({
          formattedGames: gamesArray,
          formattedResults: resultsArray,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);


  useEffect(() => {
    if (gameName && formattedDate) {
      const existingResult = results.find(
        (r) =>
          r.gameName === gameName &&
          formatDate(new Date(r.date)) === formattedDate
      );
      if (existingResult) {       
        Object.keys(existingResult).forEach((key) => {
          if (key.endsWith("D")) setValue(key, existingResult[key] || "*");
        });
      } else {
        
        [
          "firstD",
          "secondD",
          "thirdD",
          "fourD",
          "fiveD",
          "sixD",
          "sevenD",
          "eightD",
        ].forEach((field) => {
          setValue(field, "*");
        });
      }
    }
  }, [gameName, formattedDate, results, setValue]);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  const submit = async (data) => {
    const formattedData = {
      ...data,
      date: formattedDate,
      firstD: data.firstD || "*",
      secondD: data.secondD || "*",
      thirdD: data.thirdD || "*",
      fourD: data.fourD || "*",
      fiveD: data.fiveD || "*",
      sixD: data.sixD || "*",
      sevenD: data.sevenD || "*",
      eightD: data.eightD || "*",
    };

    try {
      const dbResult = await appwriteResult.createOrUpdateResult(formattedData);

      if (dbResult) {
        dispatch(updateResult(dbResult) || addResult(dbResult));
        navigate(`/result/${slugTransform(dbResult.gameName)}`);
      }
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="mx-auto w-full max-w-xl bg-gray-100 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold leading-tight">
          Update Your Existing Result
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t want to Update the result?&nbsp;
          <Link
            to="add-result"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Go to Add Result link
          </Link>
        </p>

        <form onSubmit={handleSubmit(submit)} className="mt-8">
          <div className="space-y-5">
            <h4 className="select_game text-left">Select Game</h4>
            <Select
              options={allData?.formattedGames?.map((game) => game.title) || []}
              label="Select Game"
              className="mb-4 mt-0"
              {...register("gameName", { required: true })}
            />
            <div className="date_cont w-full">
              <label className="block text-sm font-medium text-gray-700">
                Game Date:
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                maxDate={new Date()}
                showYearDropdown
                dateFormat="yyyy-MM-dd"
                className="border rounded p-2 w-full"
              />
            </div>

            <div className="edit_result_section gap-1 grid grid-cols-8">
              {[
                "firstD",
                "secondD",
                "thirdD",
                "fourD",
                "fiveD",
                "sixD",
                "sevenD",
                "eightD",
              ].map((field, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  placeholder={`N-${index + 1}`}
                  {...register(field)}
                  className="text-center"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full hover:bg-red-700 text-white"
            >
              Update Result
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;
