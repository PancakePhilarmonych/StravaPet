import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'This is the activities endpoint',
  });
});

export default router;