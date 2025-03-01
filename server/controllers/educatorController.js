import { clerkClient } from '@clerk/clerk-sdk-node';


export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log(req.auth.userId)
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    console.log("User ID:", userId);

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      }
    });

    res.json({ success: true, message: "You can publish your courses now!" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};