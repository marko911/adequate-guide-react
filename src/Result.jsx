import React from "react";

export default function SearchResult({ data, onSave }) {
  const {
    artistName,
    artworkUrl60,
    wrapperType,
    collectionName,
    trackName,
    primaryGenreName,
  } = data;
  const isAudiobook = wrapperType === "audiobook";
  return (
    <tr>
      <td className="px-6 py-4 max-w-cell whitespace-nowrap overflow-hidden truncate">
        <div className="flex items-center truncate">
          <div className="flex-shrink-0 h-10 w-10">
            <img className="h-10 w-10 rounded-full" src={artworkUrl60} alt="" />
          </div>
          <div className="ml-4 truncate">
            <div className="text-sm font-medium text-gray-900 truncate">
              {artistName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap max-w-cell overflow-hidden	">
        <div className="text-sm text-gray-900 truncate">
          {trackName || collectionName}
        </div>
      </td>
      <td className="px-6 max-w-cell py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            isAudiobook
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          } `}
        >
          {isAudiobook ? "Audiobook" : "Podcast"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {primaryGenreName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium cursor-pointer ">
        <button
          onClick={onSave(data)}
          className="text-indigo-600 px-3 py-2 hover:text-indigo-900 rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
        >
          Save
        </button>
      </td>
    </tr>
  );
}
