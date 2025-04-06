const userAuthorization = (req, res, next) => {
    try {
        if (!req.userData) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (req.userData.roleId === 2) {
            return next();
        }
        const requestedUserId = Number(req.params.id);
        if (requestedUserId !== req.userData.id) {
            return res.status(403).json({ message: 'You can only modify your own data' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Authorization failed' });
    }
};