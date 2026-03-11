exports.handleBookingSubmission = (req, res) => {
    const { name, email, date, time, message } = req.body;
    
    console.log('New Booking Request:', { name, email, date, time, message });
    
    // For now, just log and return success
    if (!name || !email || !date || !time) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    res.status(200).json({ success: true, message: 'Booking request received' });
};
