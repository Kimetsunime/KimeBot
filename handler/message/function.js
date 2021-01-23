const updateJson = require('update-json-file');
const fs = require('fs');
const { throws } = require('assert');
//cooldown
const workCooldown = new Set()
const cpCooldown = new Set()

/**
* Updating database that contain cash database(Local)
* This is made by mangadi3859, just incase u think i stole it 
* 
*
* @param {String} id UserID
* @param {String} path File path
* @param {Number} amount how much amount
* @param {String} username this is optional but, u need this
*/
exports.cashDB = (id, path, amount, username) => {
    if(!workCooldown.has(id)) { 
        return updateJson(path, (data) => { 
            try {
                data.cash[id].amount += amount
                data.cash[id].name = username
                } 
            catch (e) {
                data.cash[id] = {
                    "amount" : amount,
                    "name" : username
                }
            }
            return data
        })
    } else throw new Error('COOLDOWN_TRIGGER')
}

/**
 * You can only use this function for UpdateJSON on cash Object!
 * 
 * @param {String} token The id of the things. 
 * @param {Number} time how long the cooldown would be.
 */
exports.workCD = (token, time) => {
    if(!time || isNaN(time)) throw new Error('MISSING_PROPERTY: time is undefined');
    if(!token) throw new Error('MISSING_PROPERTY: token is undefined');
    if(workCooldown.has(token)) return;
    else { workCooldown.add(token)
    setTimeout(() => workCooldown.delete(token), time) }
}

/** Function to see database Realtime!
 * 
 * @param {String} path database path (db.json)
 */
exports.database = (path) => {
    if(!path) throw new TypeError('missing file path for the database')
    let data = fs.readFileSync(path, 'utf8')
    return JSON.parse(data)
}

/** Database Edit
 * 
 * @param {String} path database path
 * @param {String} id database id
 * @param {Number} amount amount to bet added
 * @param {String} username username obviously
 * @param {Boolean} isPlus is the amount will be negative or positive
 */
exports.addDbAmount = (path, id, amount, username, isPlus) => {
    console.log(cpCooldown.size, cpCooldown.has(id))
    if(!cpCooldown.has(id)) { 
        return updateJson(path, (data) => {
            if(!isPlus) isPlus = true 
            try {
                if(isPlus === true) {
                    data.cash[id].amount += amount
                    data.cash[id].name = username
                }
                else if(isPlus === false) {
                    data.cash[id].amount -= amount
                    data.cash[id].name = username
                }
            } 
            catch (err) {
                data.cash[id] = {
                    "amount" : 0,
                    "name" : username
                }
                throw err
            }
            return data
        })
    } else throw new Error('COOLDOWN_TRIGGER')
}

/**
 * You can only use this function for UpdateJSON on cash Object!
 * 
 * @param {String} token The id of the things. 
 * @param {Number} time how long the cooldown would be.
 */
exports.cpCD = (token, time) => {
    if(!time || isNaN(time)) throw new Error('MISSING_PROPERTY: time is undefined');
    if(!token) throw new Error('MISSING_PROPERTY: token is undefined');
    if(!cpCooldown.has(token)) {
        cpCooldown.add(token)
        setTimeout(() => cpCooldown.delete(token), time) 
    }
}