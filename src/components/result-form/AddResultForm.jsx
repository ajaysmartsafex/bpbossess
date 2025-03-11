import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from "../index";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import appwriteResult from "../../appwrite/result";
import appwriteService from "../../appwrite/config";
import { useDispatch, useSelector } from 'react-redux';
import { setResults, addResult, updateResult, setGames } from '../../store/resultSlice';

const AddResultForm = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

   
    const reduxGames = useSelector(state => state.result.games);
    const reduxResults = useSelector(state => state.result.results);

    const [allData, setAllData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatDate = (date) => date.toISOString().split("T")[0];

   
    const { result } = props;

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            title: result?.title || "",
            gameName: result?.gameName || "",
            date: result?.date ? new Date(result.date) : new Date(),
            firstD: result?.firstD || "",
            secondD: result?.secondD || "",
            thirdD: result?.thirdD || "",
            fourD: result?.fourD || "",
            fiveD: result?.fiveD || "",
            sixD: result?.sixD || "",
            sevenD: result?.sevenD || "",
            eightD: result?.eightD || "",
        },
    });

    useEffect(() => {
        const mergedData = async () => {
            try {
                const [gameData, resultData] = await Promise.all([
                    appwriteService.getGames(),
                    appwriteResult.getResults()
                ]);

               
                const gamesArray = gameData?.documents || [];
                const resultsArray = resultData?.documents || [];

              
                dispatch(setGames(gamesArray));
                dispatch(setResults(resultsArray));

                
                setAllData({
                    formattedGames: gamesArray,
                    formattedResults: resultsArray,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        mergedData();
        
    }, [dispatch]);

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
        data.date = formatDate(selectedDate);
        const formattedData = { ...data, date: formatDate(selectedDate) };

        try {
            const dbResult = await appwriteResult.createOrUpdateResult(formattedData);

            if (dbResult) {
                if (result?.gameId) {
                    dispatch(updateResult(dbResult));
                } else {
                    dispatch(addResult(dbResult));
                }
                navigate(`/result/${slugTransform(dbResult.gameName)}`);
            }
        } catch (error) {
            console.error("Error saving result:", error);
        }
    };

    const handleResultDigitChange = (fieldName) => (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 1);
        setValue(fieldName, value);
    };

    return (
      <div className="flex items-center justify-center w-full py-8">
        <div className="mx-auto w-full max-w-xl bg-gray-100 rounded-xl p-10 border border-black/10">
          <h2 className="text-center text-2xl font-bold leading-tight">
            Add Game Result
          </h2>
          <p className="mt-2 text-center text-base text-black/60">
            Do you want any Update in Result?&nbsp;
            <Link
              to="/edit-result"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Go to Update Result
            </Link>
          </p>

          <form onSubmit={handleSubmit(submit)} className="mt-8">
            <div className="space-y-5">
              <h4 className="select_game text-left">Select Game</h4>
              <Select
                options={
                  allData?.formattedGames?.map((game) => game.title) || []
                }
                label="Status"
                className="mb-4 mt-0"
                {...register("gameName", { required: true })}
              />
              <div className="date_cont w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Game Date:
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setValue("createdate", formatDate(date));
                  }}
                  maxDate={new Date()}
                  showYearDropdown
                  dateFormat="yyyy-MM-dd"
                  className="border rounded p-2 w-full"
                />
              </div>

              <div className="edit_result_section gap-1">
                <div className="columns-5xl">
                  <h4 className="text-left">Left</h4>
                  <div className="flex justify-between columns-12">
                    <Input
                      placeholder="N-1"
                      {...register("firstD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("firstD")}
                    />
                    <Input
                      placeholder="N-2"
                      {...register("secondD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("secondD")}
                    />
                    <Input
                      placeholder="N-3"
                      {...register("thirdD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("thirdD")}
                    />
                  </div>
                </div>
                <div className="columns-2xl">
                  <h4 className="text-left">Mid</h4>
                  <div className="flex justify-between columns-12">
                    <Input
                      placeholder="N-4"
                      {...register("fourD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("fourD")}
                    />
                    <Input
                      placeholder="N-5"
                      {...register("fiveD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("fiveD")}
                    />
                  </div>
                </div>
                <div className="columns-5xl">
                  <h4 className="text-left">Right</h4>
                  <div className="flex justify-between columns-12">
                    <Input
                      placeholder="N-6"
                      {...register("sixD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("sixD")}
                    />
                    <Input
                      placeholder="N-7"
                      {...register("sevenD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("sevenD")}
                    />
                    <Input
                      placeholder="N-8"
                      {...register("eightD")}
                      type="text"
                      maxLength={1}
                      onChange={handleResultDigitChange("eightD")}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full hover:bg-red-700 text-white"
              >
                Add Result
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default AddResultForm;
