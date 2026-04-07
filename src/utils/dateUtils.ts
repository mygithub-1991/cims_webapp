/**
 * Date utility functions for IST timezone handling
 * Matches the backend IST timezone implementation
 */

// Format timestamp to readable date (IST)
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format timestamp to readable datetime (IST)
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Format timestamp to time only (IST)
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Get current timestamp
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

// Get start of day for given timestamp (IST)
export const getStartOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istDate.setHours(0, 0, 0, 0);
  return istDate.getTime();
};

// Get end of day for given timestamp (IST)
export const getEndOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istDate.setHours(23, 59, 59, 999);
  return istDate.getTime();
};

// Check if timestamp is today (IST)
export const isToday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const today = new Date();

  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const istToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  return (
    istDate.getDate() === istToday.getDate() &&
    istDate.getMonth() === istToday.getMonth() &&
    istDate.getFullYear() === istToday.getFullYear()
  );
};

// Format relative date (Today, Yesterday, or date)
export const formatRelativeDate = (timestamp: number): string => {
  if (isToday(timestamp)) {
    return 'Today';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isToday(yesterday.getTime())) {
    return 'Yesterday';
  }

  return formatDate(timestamp);
};

// Convert date input to timestamp (start of day IST)
export const dateToTimestamp = (dateString: string): number => {
  const date = new Date(dateString);
  return getStartOfDay(date.getTime());
};

// Get month name from timestamp
export const getMonthName = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'long',
    year: 'numeric',
  });
};
