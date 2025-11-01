var express = require('express');
var router = express.Router();
const pool = require('../dbconfig');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: API for managing records
 */

/**
 * @swagger
 * /records/addRecord:
 *   post:
 *     summary: Add a new record
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the record
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status of the record
 *     responses:
 *       201:
 *         description: Record added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

// Add Record
router.post('/addRecord', auth, async (req, res,) => {
    try {
        const { name, status } = req.query;
        const insertQuery = 'INSERT INTO records (name, status) VALUES ($1, $2) RETURNING *';

        if (!name || !status)
            return res.status(400).json({ error: "Name and Status are required" });

        const result = await pool.query(insertQuery, [name, status]);
        res.status(201).json({ Record: result.rows[0], message: 'Add Record Successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @swagger
 * /records/getRecords:
 *   get:
 *     summary: Get all records or filter by status
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter records by status
 *     responses:
 *       200:
 *         description: List of records
 *       500:
 *         description: Internal server error
 */

// Retrieve all or filter by status
router.get('/getRecords', auth, async (req, res) => {
    try {
        const { status } = req.query;
        const getfilteredRecord = `SELECT * FROM records WHERE status = $1`;
        const getAlldata = `SELECT * FROM records`;
        let result;

        if (status) {
            result = await pool.query(getfilteredRecord, [status]);
        }
        else {
            result = await pool.query(getAlldata);
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /records/updateRecord:
 *   put:
 *     summary: Update a record
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the record
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Updated name
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Updated status
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */

// ✅ Update Record
router.put("/updateRecord", auth, async (req, res) => {
    try {
        const { id, name, status } = req.query;
        if (!id || !name || !status) {
            return res.status(400).json({ error: "id, name, and status are required" });
        }
        const updateQuery = "UPDATE records SET name = $1, status = $2 WHERE id = $3 RETURNING *"
        const result = await pool.query(updateQuery, [name, status, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.status(200).json({
            message: "Record updated successfully!",
            record: result.rows[0],
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})



/**
 * @swagger
 * /records/deleteRecord:
 *   delete:
 *     summary: Delete a record by ID
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the record
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
// Delete Record
router.delete("/deleteRecord", auth, async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: "id is required" });
        }
        const deleteQuery = `DELETE FROM records WHERE id = $1`;
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Record not found" });

        res.json({ message: "Record deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;