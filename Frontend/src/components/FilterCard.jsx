import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
  {
    filterType: "Location",
    array: ["Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi", "Kolkata", "Ahmedabad"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "DevOps Engineer", "AI Engineer", "UI/UX Designer"]
  },
  {
    filterType: "Salary",
    array: ["5-8 LPA", "8-12 LPA", "12-20 LPA", "20+ LPA"]
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);

    if (value.includes("LPA")) {
      const numbers = value.match(/\d+/g)?.map(Number);
      let min = numbers?.[0] || 0;
      let max = numbers?.[1] || 100;

      if (value.includes("20+")) {
        min = 20;
        max = Infinity;
      }

      dispatch(setSearchedQuery({ type: "salary", min, max }));
    } else {
      dispatch(setSearchedQuery({ type: "text", value }));
    }
  };

  return (
    <div className='w-full bg-white p-3 rounded-md shadow-sm sm:p-4 md:p-5'>
      <h1 className='font-bold text-lg sm:text-xl mb-2'>Filter Jobs</h1>
      <hr className='mt-2 mb-4' />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {
          filterData.map((data, index) => (
            <div key={index} className="mb-6">
              <h1 className='font-bold text-md sm:text-lg mb-2'>{data.filterType}</h1>
              {
                data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div key={itemId} className='flex flex-wrap sm:flex-nowrap items-center space-x-2 my-2'>
                      <RadioGroupItem value={item} id={itemId} />
                      <Label htmlFor={itemId} className="text-sm sm:text-base">{item}</Label>
                    </div>
                  );
                })
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
