import React from "react";

export default function Episode({ data }) {
  const {
    image: { url },
    description,
    date,
    title,
  } = data;
  const d = new Date(date);

  return (
    <div className="bg-white shadow h-40 overflow-hidden sm:rounded-lg flex px-6 py-4 items-center mb-4">
      <div className="flex-shrink-0 h-16 w-16 ">
        <img className="h-16 w-16 rounded-full" src={url} alt="" />
      </div>
      <div className="px-4 py-2 sm:px-6 h-full truncate">
        <span className="font-sm text-indigo-600">{title}</span>
        <h3
          className="text-base leading-6 font-medium text-gray-900 truncate"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{d.toDateString()}</p>
      </div>
    </div>
  );
}
