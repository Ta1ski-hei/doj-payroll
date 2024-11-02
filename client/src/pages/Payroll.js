import React, { useState, useEffect } from 'react';

function Payroll() {
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(getDefaultWeek());
  const [expandedAuthor, setExpandedAuthor] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);

  // Funkce pro získání aktuálního týdne ve formátu YYYY-Www
  function getDefaultWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const week = Math.floor(((now - start) / 86400000 + start.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
  }

  // Funkce pro převod týdne na rozsah dat
  function getWeekRange(weekString) {
    const [year, week] = weekString.split('-W');
    const start = new Date(year, 0, 1 + (week - 1) * 7);
    start.setDate(start.getDate() - start.getDay() + 1); // Pondělí
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Neděle
    return { start, end };
  }

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  const fetchWorkLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/work-logs');
      const data = await response.json();
      setWorkLogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Chyba při načítání dat:', error);
      setLoading(false);
    }
  };

  const filterLogsByWeek = (logs) => {
    const { start, end } = getWeekRange(selectedWeek);
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  };

  const groupLogsByAuthor = (logs) => {
    return logs.reduce((acc, log) => {
      if (!acc[log.author]) {
        acc[log.author] = {
          logs: [],
          totalPay: 0
        };
      }
      acc[log.author].logs.push(log);
      acc[log.author].totalPay += log.pay || 0;
      return acc;
    }, {});
  };

  const formatDateRange = (weekString) => {
    const { start, end } = getWeekRange(weekString);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const filteredLogs = filterLogsByWeek(workLogs);
  const groupedLogs = groupLogsByAuthor(filteredLogs);

  // Funkce pro formátování času
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Funkce pro zobrazení detailu výpočtu
  const renderPaymentDetail = (log) => {
    if (!log.workType) return null;

    return (
      <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm">
        <h4 className="font-semibold mb-2">Výpočet odměny:</h4>
        <div className="space-y-1">
          <div>Typ práce: {log.workType}</div>
          {log.timeRange && (
            <>
              <div>Časový rozsah: {log.timeRange}</div>
              <div>Odpracováno: {formatDuration(log.duration)}</div>
            </>
          )}
          <div className="mt-2">
            <div className="text-gray-600">Sazba:</div>
            <div>Minimální: ${log.minPay?.toLocaleString()}</div>
            <div>Maximální: ${log.maxPay?.toLocaleString()}</div>
            <div className="mt-1 font-semibold">
              Vypočtená odměna: ${log.pay?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Načítání...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Výplaty</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Týden
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm"
            />
            <span className="text-sm text-gray-500">
              {formatDateRange(selectedWeek)}
            </span>
          </div>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Jméno</th>
              <th className="px-6 py-3 text-left">Počet záznamů</th>
              <th className="px-6 py-3 text-left">Celková částka</th>
              <th className="px-6 py-3 text-left">Akce</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedLogs).map(([authorId, data]) => (
              <React.Fragment key={authorId}>
                <tr className="border-t">
                  <td className="px-6 py-4">{data.logs[0]?.authorName || authorId}</td>
                  <td className="px-6 py-4">{data.logs.length}</td>
                  <td className="px-6 py-4">${data.totalPay.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setExpandedAuthor(expandedAuthor === authorId ? null : authorId)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedAuthor === authorId ? 'Skrýt detail' : 'Zobrazit detail'}
                    </button>
                  </td>
                </tr>
                {expandedAuthor === authorId && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 bg-gray-50">
                      <div className="space-y-2">
                        {data.logs.map((log, index) => (
                          <div key={index} className={`border-b pb-2 ${!log.workType ? 'bg-red-50' : ''}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold">{new Date(log.timestamp).toLocaleString()}</div>
                                <div className={`${!log.workType ? 'text-red-600 font-semibold' : ''}`}>
                                  {log.workType || 'NEROZPOZNANÝ TYP PRÁCE'}
                                  {log.timeRange && (
                                    <span className="ml-2 text-sm text-gray-600">
                                      ({log.timeRange}, {Math.round(log.duration / 60 * 10) / 10} hodin)
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">{log.content}</div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className={`font-semibold ${!log.workType ? 'text-red-600' : ''}`}>
                                  ${log.pay?.toLocaleString() || 0}
                                </div>
                                {log.workType && (
                                  <button
                                    onClick={() => setExpandedPayment(expandedPayment === index ? null : index)}
                                    className="text-sm text-blue-500 hover:text-blue-700"
                                  >
                                    {expandedPayment === index ? 'Skrýt výpočet' : 'Zobrazit výpočet'}
                                  </button>
                                )}
                              </div>
                            </div>
                            {expandedPayment === index && renderPaymentDetail(log)}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payroll; 