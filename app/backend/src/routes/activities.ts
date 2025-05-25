import { Router } from 'express';

const router = Router();

router.get('/activities', (req, res) => {
  res.json({
    message: 'This is the activities endpoint',
  });
});

export default router;