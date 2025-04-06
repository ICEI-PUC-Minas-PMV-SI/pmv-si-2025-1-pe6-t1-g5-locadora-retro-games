const isAdmin = (req, res, next) => {
    try {
        // check if user data exists (set by auth middleware)
        if (!req.userData) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // check if user has admin role (roleId === 1)
        if (req.userData.roleId !== 1) {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Authorization failed' });
    }
};

export default isAdmin;