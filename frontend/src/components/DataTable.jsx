import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable, stylized data table component for dashboards.
 * 
 * @param {string[]} headers - Array of header titles.
 * @param {any[]} data - Array of data objects to display.
 * @param {function} renderRow - Function that returns an array of <td> elements for a given data item.
 * @param {string} emptyMessage - Message to show when data is empty.
 */
const DataTable = ({ headers, data, renderRow, emptyMessage = "No records found." }) => {
  return (
    <div className="data-table-container">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <motion.tr 
                  key={item._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {renderRow(item)}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="p-12 text-center text-text-muted">
                  <div className="flex flex-col items-center gap-2">
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
