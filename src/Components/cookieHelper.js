/**
 * Function to get object from cookie by name
 * @param cookie_name
 * @returns {*}
 */
export function get_cookie ( cookie_name )
{
    let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results) {
        return JSON.parse(results[2]);
    }
    else
        return null;
}
