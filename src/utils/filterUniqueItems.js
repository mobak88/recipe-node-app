/**
 * Reusable function to create arrays with unique values (set)
 * takes array, set and keyname as parameters
 * returns the set of unique values
 * */

exports.filterUniqueItems = (arr, uniqueSet, keyName) => {
    const filtered = arr.filter(item => {
        if (!uniqueSet.has(item[keyName])) {
            uniqueSet.add(item[keyName]);
            return true;
        }
        return false;
    });

    return filtered;
};