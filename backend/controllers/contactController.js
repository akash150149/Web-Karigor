exports.handleContactSubmission = (req, res) => {
    const { name, email, message } = req.body;
    
    console.log('New Contact Submission:', { name, email, message });
    
    // For now, just log and return success
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    res.status(200).json({ success: true, message: 'Message received successfully' });
};
